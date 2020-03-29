import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error}) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id}
              })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  onChange={this.handleChange}
                  value={this.state.title}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title"
                  required />
              </label>
              <label htmlFor="price">
                Price
                <input
                  onChange={this.handleChange}
                  value={this.state.price}
                  type="number"
                  id="price"
                  name="price"
                  placeholder="price"
                  required />
              </label>
              <label htmlFor="description">
                Price
                <textarea
                  onChange={this.handleChange}
                  value={this.state.description}
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
          )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
