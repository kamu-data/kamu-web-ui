IMAGE_REPO = ghcr.io/kamu-data

#########################################################################################

KAMU_WEB_UI_VERSION = $(shell cat ../package.json | jq -r '.version')
KAMU_WEB_UI_IMAGE = $(IMAGE_REPO)/kamu-web-ui

#########################################################################################

.PHONY: kamu-web-ui
kamu-web-ui:
	docker build \
		--build-arg KAMU_WEB_UI_VERSION=$(KAMU_WEB_UI_VERSION) \
		-t $(KAMU_WEB_UI_IMAGE):$(KAMU_WEB_UI_VERSION) \
		kamu-web-ui/


.PHONY: kamu-web-ui-push
kamu-web-ui-push:
	docker push $(KAMU_WEB_UI_IMAGE):$(KAMU_WEB_UI_VERSION)
	docker tag $(KAMU_WEB_UI_IMAGE):$(KAMU_WEB_UI_VERSION) $(KAMU_WEB_UI_IMAGE):latest
	docker push $(KAMU_WEB_UI_IMAGE):latest

#########################################################################################
