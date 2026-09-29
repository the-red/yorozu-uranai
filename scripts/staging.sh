#!/bin/sh
# 今のブランチを、staging に載せる
#
# staging は、Vercel のプレビューを、固定のURLで見るためのブランチ。
# Vercel は、デプロイ済みのコミットを push しても、新しいデプロイを作らない。
# プルリクエストのあるブランチは、すでにデプロイ済みなので、そのまま push しても内容が変わらない。
# そのため、空のコミットを1つ足して push する。手元のブランチは変わらない
set -e

URL=https://yorozu-uranai-git-staging-the-red-creation.vercel.app

if [ -n "$(git status --porcelain)" ]; then
  echo '注意: コミットしていない変更があります。staging に載るのは、コミット済みの内容だけです。' >&2
fi

branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git commit-tree 'HEAD^{tree}' -p HEAD -m "staging: ${branch} を確認する")
git push --force origin "${commit}:refs/heads/staging"

echo
echo "staging に載せました: ${branch} ($(git rev-parse --short HEAD))"
echo "デプロイが終わると、ここで確認できます: ${URL}"
