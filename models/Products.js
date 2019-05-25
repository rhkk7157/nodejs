const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var Products = sequelize.define('Products',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING },
            thumbnail : { type: DataTypes.STRING },
            price: { type: DataTypes.INTEGER },
            description: { type: DataTypes.TEXT }
        }
    );

    // 제품 모델 관계도
    Products.associate = (models) => {

        // 메모 모델에 외부키를 건다
        // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 싹다 삭제해준다
        Products.hasMany(models.ProductsMemo, { as: 'Memo', foreignKey: 'product_id', sourceKey: 'id', onDelete: 'CASCADE' });

    };

    Products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    // Products.prototype.dateFormat = (date) => {
    //    return moment(date).format('YYYY-MM-DD')
    // };
    return Products;
}



