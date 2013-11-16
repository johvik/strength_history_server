REPORTER=spec

test-dist:
	@cp config/sample_config.js config/config.js
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)

lint-dist:
	@./node_modules/.bin/jshint ./lib ./test ./index.js

lint:
	@node node_modules/jshint/bin/jshint ./lib ./test ./index.js

test-coveralls: lib-cov
	@STRENGTH_HISTORY_COV=1 $(MAKE) test-dist REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	@rm -rf lib-cov
	$(MAKE) test-dist REPORTER=spec
	$(MAKE) lint-dist

test-cov: lib-cov
	@STRENGTH_HISTORY_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@./node_modules/.bin/jscoverage lib lib-cov

.PHONY: test
