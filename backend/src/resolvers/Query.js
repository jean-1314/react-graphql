const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // async items(parents, args, ctx, info) {
  //   const items = await ctx.query.items();
  //   return items;
  // }
};

module.exports = Query;
