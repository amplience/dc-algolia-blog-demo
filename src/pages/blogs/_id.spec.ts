import flushPromises from 'flush-promises';
import DynamicContentRenderingService from '@/services/dynamic-content-rendering/dynamic-content-rendering.service';
import BlogPost from './_id.vue';
import { shallowMount } from '~/node_modules/@vue/test-utils';

const mockGetRenderedContentItem = jest.fn();

jest.mock(
  '@/services/dynamic-content-rendering/dynamic-content-rendering.service',
  (): Function => {
    return jest.fn(
      (): { getRenderedContentItem: Function } => {
        return {
          getRenderedContentItem: mockGetRenderedContentItem
        };
      }
    );
  }
);

describe('/blogs/_id', (): void => {
  afterAll(
    (): void => {
      jest.restoreAllMocks();
    }
  );

  test('renders a page with the data from the renderedContentItem', async (): Promise<void> => {
    const wrapperHtml = '<h1>Blog Post</h1><p>Blog Blurb</p>';
    mockGetRenderedContentItem.mockResolvedValueOnce({ body: wrapperHtml });

    const wrapper = await shallowMount(BlogPost, {
      mocks: {
        $route: {
          params: {
            id: 'blog-post-id'
          }
        }
      }
    });

    // multiple promises are pending so flush all before we assert the result
    await flushPromises();

    expect(DynamicContentRenderingService).toHaveBeenCalled();
    expect(mockGetRenderedContentItem).toBeCalledWith('blog-post-id', '');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
