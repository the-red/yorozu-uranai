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
head=$(git rev-parse --short HEAD)
commit=$(git commit-tree 'HEAD^{tree}' -p HEAD -m "staging: ${branch} を確認する")
git push --force origin "${commit}:refs/heads/staging"

echo
echo "staging に push しました: ${branch} (${head})"

# デプロイの結果を待つ
# NOTE: ビルドに失敗すると、URLの内容は前のままになる。成功を確かめてから、確認を始める
if ! command -v gh >/dev/null 2>&1; then
  echo 'GitHub CLI（gh）が無いので、デプロイの結果を確かめられません。Vercel の画面で確かめてください。'
  exit 0
fi

repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo 'デプロイの結果を待っています（1〜2分かかります）'
i=0
while [ $i -lt 60 ]; do
  sleep 5
  i=$((i + 1))
  id=$(gh api "repos/${repo}/deployments?sha=${commit}&per_page=1" -q '.[0].id' 2>/dev/null || true)
  [ -n "$id" ] || continue
  state=$(gh api "repos/${repo}/deployments/${id}/statuses?per_page=1" -q '.[0].state' 2>/dev/null || true)
  case "$state" in
    success)
      echo "デプロイに成功しました: ${URL}"
      exit 0
      ;;
    failure | error)
      log=$(gh api "repos/${repo}/deployments/${id}/statuses?per_page=1" -q '.[0].target_url' 2>/dev/null || true)
      echo "デプロイに失敗しました。${URL} の内容は、前のままです。" >&2
      echo "失敗したデプロイ: ${log}" >&2
      exit 1
      ;;
  esac
done

echo "デプロイの結果を確かめられませんでした。Vercel の画面で確かめてください。" >&2
exit 1
