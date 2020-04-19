import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer} from 'react-apollo';
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveFromCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

global.alert = jest.fn();

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: 'abc123' })]
        }
      }
    }
  },
  {
    request: { query: REMOVE_FROM_CART_MUTATION, variables: { id: 'abc123' } },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: 'abc123'
        }
      }
    }
  }
];

describe('<RemoveFromCart />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RemoveFromCart id="abc123" />
      </MockedProvider>
    );
    expect(toJson(wrapper.find('button'))).toMatchSnapshot();
  });

  it('removes the item from cart', async () => {
    let apolloClient = null;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart id="abc123" />
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const response = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(response.data.me.cart).toHaveLength(1);
    expect(response.data.me.cart[0].item.price).toBe(5000);
    wrapper.find('button').simulate('click');
    await wait();
    const response2 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(response2.data.me.cart).toHaveLength(0);
  });
});