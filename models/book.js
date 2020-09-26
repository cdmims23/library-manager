'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {
      shortDescription() {
        const shortDesc = this.title.length > 40 ? `${this.title.substring(0 ,40)}...` : this.title;
        return shortDesc;
      }
    }

    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
              notEmpty: {
                msg: '"Title" is required'
              }, 
            }
          },
          author: {
              type: Sequelize.STRING,
              validate: {
                  notEmpty: {
                      msg: '"Author" is required'
                  }
              }
          },
          genre: Sequelize.STRING,
          year: Sequelize.INTEGER 
    }, { sequelize });

    return Book;
}

