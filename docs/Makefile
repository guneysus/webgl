default: develop

develop:
	npx live-server
	
build:
	npx esbuild --bundle --external:fs index.js --outdir=dist --target=chrome80  --format=iife --sourcemap
	
test:
	npm test
		
.PHONY: default develop build test