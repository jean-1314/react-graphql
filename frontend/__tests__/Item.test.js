import Item from '../components/Item';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'img.jpg',
  largeImage: 'largeImg.jpg'
};

describe('<Item />', () => {
  it('renders the price tag and title properly', () => {
    const wrapper = shallow(<Item item={fakeItem}/>);
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$50');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });
  it('renders the image properly', () => {
    const wrapper = shallow(<Item item={fakeItem}/>);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });
  it('renders out the buttons properly', () => {
    const wrapper = shallow(<Item item={fakeItem}/>);
    const ButtonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(ButtonList.find('Link').exists()).toBeTruthy();
    expect(ButtonList.find('AddToCart').exists()).toBeTruthy();
    expect(ButtonList.find('DeleteFromCart').exists()).toBeTruthy();
  });
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});