rm -rf dist
cp -r public dist
# do not include DATA
rm -rf dist/DATA
# do not include .json
rm -rf dist/*.json

surge dist figurl-raster-vis.surge.sh