cd out

aws s3 rm s3://projectionfrontend --recursive
aws s3 cp ./ s3://projectionfrontend/ --recursive --exclude "*.html"

for file in $(find ./ -name '*.html' | sed 's|^\./||'); do
    aws s3 cp ${file%} s3://projectionfrontend/${file%.*} --content-type 'text/html'
done
