.PHONY: default
default: lint test

.PHONY: test
test:
	./node_modules/.bin/mocha-phantomjs --reporter spec test/index.html

.PHONY: lint
lint:
	gjslint --recurse . \
    --exclude_directories "node_modules,test/resources" \
    --exclude_files "./js/require.js"
