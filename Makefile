REPORTER=dot

test-dist:
	@cp sample_config.js config.js
	./node_modules/.bin/mocha --reporter $(REPORTER)

test:
	@mocha --reporter dot

test-coveralls: lib-cov
	@STRENGTH_HISTORY_COV=1 $(MAKE) test-dist REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-cov: lib-cov
	@mocha --reporter html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
