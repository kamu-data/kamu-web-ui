IMAGE_REPO = docker.io/kamudata

#########################################################################################

KAMU_WEB_UI_VERSION = 0.5.1
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
