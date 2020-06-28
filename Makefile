default: build
.PHONY: build npm-build webext-build

npm-build:
	npm run build

webext-build:
	web-ext build --source-dir=build

build: npm-build webext-build
