import { createLocalVue, mount, RouterLinkStub } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VueInstantSearch from 'vue-instantsearch';
import Search from './search.vue';
import searchResponse from './fixtures/search-response.json';
import searchResponseMutli from './fixtures/search-response-multiple-pages.json';
import { MultiResponse, Response } from '~/node_modules/@types/algoliasearch';
import { Card, Col, Container, Header, Main, Pagination, Row } from '~/node_modules/element-ui';

let multiFixture;
const mockSearchFn = jest.fn();
const localVue = createLocalVue();

const mountOptions = {
  localVue,
  stubs: {
    NuxtLink: RouterLinkStub
  }
};

jest.mock(
  '@/services/algolia/search-client',
  (): Function =>
    function(): { [key: string]: {} | Function } {
      return {
        client: {
          search: (): Promise<MultiResponse<Response>> => mockSearchFn.apply(null, arguments)
        }
      };
    }
);

describe('Search', (): void => {
  beforeAll(
    (): void => {
      localVue.use(Card);
      localVue.use(Row);
      localVue.use(Col);
      localVue.use(Container);
      localVue.use(Header);
      localVue.use(Main);
      localVue.use(Pagination);
      localVue.use(VueInstantSearch);
    }
  );

  afterEach(
    (): void => {
      jest.restoreAllMocks();
      multiFixture = searchResponseMutli;
    }
  );

  afterAll(
    (): void => {
      jest.resetModules();
    }
  );

  test('is a search result', async (): Promise<void> => {
    mockSearchFn.mockImplementation(
      async (): Promise<MultiResponse<Response>> => {
        return { results: [searchResponse] };
      }
    );

    const wrapper = mount(Search, mountOptions);
    wrapper.setData({
      numberOfSearchResults: 1
    });

    await flushPromises();
    expect(mockSearchFn).toBeCalled();
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.element).toMatchSnapshot();
    wrapper.destroy();
  });

  test('is a search result with pagination', async (): Promise<void> => {
    mockSearchFn.mockImplementation(
      async (): Promise<MultiResponse<Response>> => {
        return { results: [multiFixture] };
      }
    );

    const wrapper = mount(Search, mountOptions);
    wrapper.setData({
      numberOfSearchResults: 2
    });

    await flushPromises();
    const nextLink = wrapper.findAll('.ais-Pagination-item--nextPage .ais-Pagination-link').at(0);
    nextLink.trigger('click');
    await flushPromises();
    const activePage = wrapper.findAll('.ais-Pagination-item--selected').at(0);
    expect(activePage.text()).toEqual('2');
    const disabledNextPage = wrapper.findAll('.ais-Pagination-item--nextPage').at(0);
    expect(disabledNextPage.classes()[2]).toBe('ais-Pagination-item--disabled');
    expect(mockSearchFn).toHaveBeenCalled();
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.element).toMatchSnapshot();
    wrapper.destroy();
  });

  test('is passed the default configured number of search results', async (): Promise<void> => {
    mockSearchFn.mockImplementation(
      async (): Promise<MultiResponse<Response>> => {
        return { results: [multiFixture] };
      }
    );

    const wrapper = mount(Search, mountOptions);
    await flushPromises();
    expect(mockSearchFn).toBeCalled();
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.vm.$data.numberOfSearchResults).toEqual(9);
    wrapper.destroy();
  });
});
