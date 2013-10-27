REPORTER=dot

test-dist:
	@cp sample_config.js config.js
	./node_modules/.bin/mocha --reporter $(REPORTER)

test:
	@mocha --reporter dot

lint:
	./node_modules/.bin/jshint ./lib ./test ./index.js

test-coveralls: lib-cov
	@STRENGTH_HISTORY_COV=1 $(MAKE) test-dist REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	rm -rf lib-cov
	$(MAKE) test-dist REPORTER=spec
	$(MAKE) lint

test-cov: lib-cov
	@mocha --reporter html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
