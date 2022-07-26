set -e
npm run build
cd dist
git init
git branch -m main
git add -A
git commit -m "deploy"
git push -f https://github.com/learnpytest/simple-twitter-clone.git main:gh-pages
