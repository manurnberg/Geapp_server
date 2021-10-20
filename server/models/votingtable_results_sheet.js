const Sequelize = require('sequelize');


module.exports = function (sequelize, DataTypes) {
  const VotingTableSheet =  sequelize.define('votingtable_results_sheet', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    votingtable_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    effective_voters: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    votes_in_ballot_box: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    identity_contest_votes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    null_votes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    appealed_votes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    white_votes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_votes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sheet_reference: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'votingtable_results_sheet',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return VotingTableSheet
};
