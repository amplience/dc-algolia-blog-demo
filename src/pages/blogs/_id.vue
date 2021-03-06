<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="contentItem.body"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ContentClientConfig, RenderedContentItem } from '~/node_modules/dc-delivery-sdk-js';
import DynamicContentRenderingService from '@/services/dynamic-content-rendering/dynamic-content-rendering.service';

const accountId: string = process.env.DC_RENDERING_SERVICE_ACCOUNT_ID || '';
const stagingVseDomain: string | undefined = process.env.DC_RENDERING_SERVICE_STAGING_DOMAIN;
const baseUrl: string | undefined = process.env.DC_RENDERING_SERVICE_BASE_URL;
const renderingTemplate: string = process.env.DC_BLOG_POST_RENDERING_TEMPLATE || '';

@Component({})
export default class BlogPost extends Vue {
  private contentItem?: RenderedContentItem;

  public data() {
    return {
      contentItem: {}
    };
  }

  public async mounted() {
    await this.getContentItem();
  }

  public async getContentItem(): Promise<void> {
    try {
      const renderingServiceConfig: ContentClientConfig = {
        account: accountId
      };

      if (stagingVseDomain) {
        renderingServiceConfig.stagingEnvironment = stagingVseDomain;
      }

      if (baseUrl) {
        renderingServiceConfig.baseUrl = baseUrl;
      }

      const service = new DynamicContentRenderingService(renderingServiceConfig);
      this.contentItem = await service.getRenderedContentItem(this.$route.params.id, renderingTemplate);
    } catch (err) {
      // handle error
      console.error(err);
    }
  }
}
</script>

<style>
.amp-dc-blog-content img {
  width: 100%;
}

.amp-dc-blog-title {
  font-weight: 500;
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #1a1a1a;
}

.amp-dc-banner {
  position: relative;
}

.amp-dc-banner .amp-dc-banner-info-wrap {
  position: absolute;
}

.amp-dc-banner-info {
  padding: 10px;
}

.amp-dc-banner-info .amp-dc-banner-header {
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 5px;
}

.amp-dc-banner-info .amp-dc-banner-subheader {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 2px;
}

.amp-dc-banner-info .amp-dc-banner-description {
  font-weight: 500;
  font-size: 12px;
}

.amp-dc-text h3,
h5 {
  margin: 5px 0px;
}
</style>
