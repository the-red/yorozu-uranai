#!/bin/sh
# 今のブランチを、staging に載せる
#
# staging は、Vercel のプレビューを、固定のURLで見るためのブランチ。
#
# Vercel は、デプロイ済みのコミットを push しても、新しいデプロイを作らないことがある。
# そのときは、エラーにならず、URLの内容が前のままになる。
#   - staging で以前にデプロイしたコミットを、もう一度 push したとき（A → B → A と載せ替えたとき）
#   - デプロイ済みのコミットで、新しいブランチを作ったとき
# 空のコミットを1つ足して push すると、必ずデプロイされる。手元のブランチは変わらない
set -e

URL=https://staging.yorozu-uranai.com

if [ -n "$(git status --porcelain)" ]; then
  echo '注意: コミットしていない変更があります。staging に載るのは、コミット済みの内容だけです。' >&2
fi

branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git commit-tree 'HEAD^{tree}' -p HEAD -m "staging: ${branch} を確認する")
git push --force origin "${commit}:refs/heads/staging"

echo
echo "staging に載せました: ${branch} ($(git rev-parse --short HEAD))"
echo "デプロイが終わると、ここで確認できます: ${URL}"
