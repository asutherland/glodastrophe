default: build
.PHONY: build logic-inspector-build npm-build webext-build

logic-inspector-build:
	cd deps/gelam/logic-inspector && make

npm-build:
	npm run build

webext-build:
	web-ext build --source-dir=build

build: logic-inspector-build npm-build webext-build
