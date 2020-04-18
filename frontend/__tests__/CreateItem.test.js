import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem} from '../lib/testUtils';

const image = 'https://image.com/image.jpg';

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: image,
    eager: [{ secure_url: image }]
  })
});

describe('<CreateItem />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJson(form)).toMatchSnapshot();
  });
  it('uploads a file when change', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['fakeImage.jpg'] }});
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state.image).toEqual(image);
    expect(component.state.largeImage).toEqual(image);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });
  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    wrapper
      .find('#title')
      .simulate('change', { target: { value: 'testing', name: 'title' } });
    wrapper
      .find('#price')
      .simulate('change', { target: { value: 50000, name: 'price', type: 'number' } });
    wrapper
      .find('#description')
      .simulate('change', { target: { value: 'Item', name: 'description' } });
    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: 'testing',
      price: 50000,
      description: 'Item'
    });
  });
  it('creates an item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [{
      request: {
        query: CREATE_ITEM_MUTATION,
        variables: {
          title: item.title,
          description: item.description,
          image: '',
          largeImage: '',
          price: item.price
        }
      },
      result: {
        data: {
          createItem: {
            ...fakeItem,
            id: 'abc123',
            __typename: 'Item'
          }
        }
      }
    }];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    wrapper
      .find('#title')
      .simulate('change', { target: { value: item.title, name: 'title' } });
    wrapper
      .find('#price')
      .simulate('change', { target: { value: item.price, name: 'price', type: 'number' } });
    wrapper
      .find('#description')
      .simulate('change', { target: { value: item.description, name: 'description' } });
    Router.router = { push: jest.fn() };
    wrapper.find('form').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({pathname: '/item', query: {id: 'abc123'}});
  });
});