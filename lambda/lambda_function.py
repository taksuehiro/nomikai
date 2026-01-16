import json
import boto3
import os
from typing import Dict, List, Any

bedrock = boto3.client('bedrock-runtime', region_name=os.environ.get('AWS_REGION', 'ap-northeast-1'))
MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0'

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda関数: 飲み会の席順を最適化する
    """
    try:
        # リクエストボディを取得
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        participants = body.get('participants', [])
        constraints = body.get('constraints', [])
        
        if not participants:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'error': '参加者が指定されていません'
                })
            }
        
        # Bedrockに送信するプロンプトを構築
        prompt = build_prompt(participants, constraints)
        
        # Bedrock APIを呼び出し
        response = invoke_bedrock(prompt)
        
        # レスポンスをパース
        result = parse_response(response)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'error': f'内部エラーが発生しました: {str(e)}'
            }, ensure_ascii=False)
        }


def build_prompt(participants: List[Dict], constraints: List[str]) -> str:
    """
    Bedrockに送信するプロンプトを構築
    """
    participants_text = "\n".join([
        f"- {p.get('name', '')} ({p.get('role', '')}, {p.get('age', '')}歳)"
        for p in participants
    ])
    
    constraints_text = "\n".join([
        f"{i+1}. {c}" for i, c in enumerate(constraints)
    ]) if constraints else "- 制約条件なし"
    
    prompt = f"""あなたは飲み会の席順を最適化するAIです。

## 参加者
{participants_text}

## 席のレイアウト
```
  [1] [2] [3] [4]
  ═══テーブル═══
  [5] [6] [7] [8]
      ↓出入口
```

### 席の位置関係
- 隣り合う席: 1-2, 2-3, 3-4, 5-6, 6-7, 7-8
- 向かい合う席（真正面）: 1と5, 2と6, 3と7, 4と8
- 席5-8が出入口側

## 制約条件
{constraints_text}

## 用語の解釈
- 「隣にする」「隣に配置」= 隣り合う席（上記参照）に配置する
- 「真正面を避ける」= 向かい合う席に配置しない
- 「出口側に配置」= 席5-8のいずれかに配置（席8が最も出入口に近い）
- 「近くに配置」= 隣り合う席、または向かい合う席に配置

## 重要
- 上記の制約条件のみに基づいて配置してください
- 制約条件に記載されていないこと（一般的なマナー等）は考慮不要です
- すべての制約を満たせない場合は、可能な限り多くの制約を満たし、満たせなかった制約とその理由をreasoningに記載してください

## 出力形式
以下のJSON形式で出力してください:
{{
  "seating": [{{"seat": 席番号, "name": "名前"}}, ...],
  "reasoning": "各制約条件をどう満たしたか具体的に説明"
}}

JSONのみを出力してください。"""

    return prompt


def invoke_bedrock(prompt: str) -> str:
    """
    Bedrock APIを呼び出し
    """
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2000,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    response = bedrock.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(request_body)
    )
    
    response_body = json.loads(response['body'].read())
    return response_body['content'][0]['text']


def parse_response(response_text: str) -> Dict[str, Any]:
    """
    BedrockのレスポンスをパースしてJSONを抽出
    """
    # JSONブロックを抽出
    import re
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    
    if json_match:
        json_str = json_match.group(0)
        try:
            result = json.loads(json_str)
            return result
        except json.JSONDecodeError:
            # JSONパースに失敗した場合、フォールバック
            pass
    
    # フォールバック: デフォルトのレスポンス
    return {
        'seating': [],
        'reasoning': 'レスポンスの解析に失敗しました。'
    }
