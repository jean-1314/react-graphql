import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
  push() {},
  prefetch() {}
};

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY},
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              count: length,
              __typename: 'count',
            }
          }
        }
      }
    }
  ];
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1}/>
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
  });
  it('renders pagination for 18 items', async () => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1}/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const pagination = wrapper.find('div[data-test="pagination"]');
    expect(wrapper.find('.totalPages').text()).toEqual('5');
    expect(toJson(pagination)).toMatchSnapshot();
  });
  it('disables prev button on first page', async() => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1}/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeTruthy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeFalsy();
  });
  it('disables next button on last page', async() => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5}/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeFalsy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeTruthy();
  });
  it('enables all buttons on middle page', async() => {
    const wrapper = mount (
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3}/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBeFalsy();
    expect(wrapper.find('a.next').prop('aria-disabled')).toBeFalsy();
  });
});