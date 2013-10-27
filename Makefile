test-dist:
	@cp sample_config.js config.js
	./node_modules/.bin/mocha --reporter dot

test:
	@mocha --reporter dot

test-cov: lib-cov
	@mocha --reporter html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
