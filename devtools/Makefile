####################################
# Build command for Chrome Extension https://github.com/casendler/react-chrome-extension-mv3
####################################

.PHONY: help build

help:
	$(info ${HELP_MESSAGE})
	@exit 0

build:
	@echo 'Removing prior build...'
	@rm -f formLogicDevtools.zip
	@echo 'Prior build removed!'
	@echo 'Preparing new extension build..'
	@export INLINE_RUNTIME_CHUNK=false; \
	export GENERATE_SOURCEMAP=false; \
	pnpm build
	@echo 'Renaming files...'
	@echo 'Zipping up build files for upload...'
	@zip -r -X formLogicDevtools.zip build/*
	@echo 'New extension build ready for upload!'
	@exit 0

define HELP_MESSAGE

	--- Run this command to prepare the build for upload ---
	$ make build

endef


