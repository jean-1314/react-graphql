import SingleItem from '../components/SIngleItem';

const Item = props => (
  <div>
    <SingleItem id={props.query.id}/>
  </div>
);

export default Item;