selfpath=$(cd `dirname $0`; pwd)
distpath=$selfpath/.vuepress/dist
rm -rf $distpath
$selfpath/../node_modules/.bin/vuepress build $selfpath
cd $distpath
git init
git add .
git commit -m "push docs"
git remote add origin git@github.com:rainboyOJ/JudgeServer.git
git push origin master:gh-pages -f
echo `pwd`

