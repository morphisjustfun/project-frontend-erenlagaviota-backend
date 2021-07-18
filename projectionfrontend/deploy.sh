aws s3 cp ./out/ s3://projectionfrontend/ --recursive --exclude "*.html"

for file in $(find ./out/ -name '*.html' | sed 's|^\./||'); do
    aws s3 cp ${file%} s3://projectionfrontend/${file%.*} --content-type 'text/html'
done
