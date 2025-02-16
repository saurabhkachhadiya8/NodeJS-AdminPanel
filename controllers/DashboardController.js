const userModel = require('../models/UserModel');
const categoryModel = require('../models/CategoryModel');
const subcategoryModel = require('../models/SubcategoryModel');
const extrasubcategoryModel = require('../models/ExtrasubcategoryModel');
const productModel = require('../models/ProductModel');

const fs = require('fs');
const path = require('path');
const CategoryModel = require('../models/CategoryModel');

const dashboardPage = async (req, res) => {
    try {
        return res.render('dashboard/dashboard');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const crmAnalyticsPage = async (req, res) => {
    try {
        return res.render('dashboard/crm_analytics');
    } catch (err) {
        console.log(err);
        return false;
    }
}
// category start
const categoryPage = async (req, res) => {
    try {
        let categories = await categoryModel.find({});
        let subcategories = await subcategoryModel.find({}).populate('categoryId');
        return res.render('dashboard/category/view', {
            categories,
            subcategories,
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const ajaxPagination = async (req, res) => {
    try {
        let page = req.query?.page;
        let totalPages = 1;
        let limit = 5;
        let skipedData = limit * (page - 1);
        let limitedCategories = await categoryModel.find({}).limit(limit).skip(skipedData);
        let categories = await categoryModel.find({});
        if (categories.length % limit == 0) {
            totalPages = categories.length / limit;
        } else {
            totalPages = categories.length / limit + 1;
        }
        return res.status(200).send({
            success: true,
            massage: "record successfully fetch",
            categories,
            limitedCategories,
            skipedData,
            totalPages: parseInt(totalPages)
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const createCategoryPage = async (req, res) => {
    try {
        const editid = req.query.editid;
        let singleCategory = null;
        if (editid) {
            singleCategory = await categoryModel.findById(editid);
        }
        return res.render('dashboard/category/create', {
            singleCategory
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const categoryCrud = async (req, res) => {
    try {
        const updateid = req.query.updateid;
        const { title, description, tags } = req.body;
        if (updateid) {
            const category = await categoryModel.findById(updateid);
            if (req.file) {
                if (fs.existsSync(category?.image)) {
                    fs.unlinkSync(category?.image);
                }
                await categoryModel.findByIdAndUpdate(updateid, {
                    title: title,
                    description: description,
                    image: req.file?.path,
                    tags: tags
                });
            } else {
                await categoryModel.findByIdAndUpdate(updateid, {
                    title: title,
                    description: description,
                    image: category?.image,
                    tags: tags
                });
            }
            req.flash('success', 'Category Successfully Updated.');
            return res.redirect('/dashboard/category');
        }
        await categoryModel.create({
            title: title,
            description: description,
            image: req.file?.path,
            tags: tags
        });
        req.flash('success', 'Category Successfully Created.');
        return res.redirect('/dashboard/create_category');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const deleteCategory = async (req, res) => {
    try {
        const deleteid = req.query.deleteid;
        let category = await categoryModel.findById(deleteid);
        if (fs.existsSync(category?.image)) {
            fs.unlinkSync(category?.image);
        }
        let subcategory = await subcategoryModel.find({ categoryId: deleteid });
        subcategory.map((subcat) => {
            if (fs.existsSync(subcat?.image)) {
                fs.unlinkSync(subcat?.image);
            }
        });
        let extrasubcategory = await extrasubcategoryModel.find({ categoryId: deleteid });
        extrasubcategory.map((extrasubcat) => {
            if (fs.existsSync(extrasubcat?.image)) {
                fs.unlinkSync(extrasubcat?.image);
            }
        });
        let product = await productModel.find({ categoryId: deleteid });
        product.map((pro) => {
            if (fs.existsSync(pro?.image)) {
                fs.unlinkSync(pro?.image);
            }
        });
        await categoryModel.findByIdAndDelete(deleteid);
        await subcategoryModel.deleteMany({ categoryId: deleteid });
        await extrasubcategoryModel.deleteMany({ categoryId: deleteid });
        await productModel.deleteMany({ categoryId: deleteid });
        req.flash('error', 'Records Successfully Deleted.');
        return res.redirect('/dashboard/category');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const categoryStatus = async (req, res) => {
    try {
        const { statusid, status } = req.query;
        if (status === "deactive") {
            await categoryModel.findByIdAndUpdate(statusid, {
                status: "active"
            });
            await subcategoryModel.updateMany({ categoryId: statusid }, {
                status: "active"
            });
            await extrasubcategoryModel.updateMany({ categoryId: statusid }, {
                status: "active"
            });
            await productModel.updateMany({ categoryId: statusid }, {
                status: "active"
            });
            req.flash('success', 'Category Successfully Activate.');
        } else {
            await categoryModel.findByIdAndUpdate(statusid, {
                status: "deactive"
            });
            await subcategoryModel.updateMany({ categoryId: statusid }, {
                status: "deactive"
            });
            await extrasubcategoryModel.updateMany({ categoryId: statusid }, {
                status: "deactive"
            });
            await productModel.updateMany({ categoryId: statusid }, {
                status: "deactive"
            });
            req.flash('success', 'Category Successfully Deactivate.');
        }
        return res.redirect('/dashboard/category');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const changesCatByCheckboxes = async (req, res) => {
    try {
        const checkedid = req.body.category_checkbox;
        const { deactivate, activate, deleteCat } = req.body;
        if (deactivate) {
            for (let i = 0; i < checkedid.length; i++) {
                await categoryModel.findByIdAndUpdate(checkedid[i], {
                    status: "deactive"
                });
            }
            await subcategoryModel.updateMany({ categoryId: checkedid }, {
                status: "deactive"
            });
            await extrasubcategoryModel.updateMany({ categoryId: checkedid }, {
                status: "deactive"
            });
            await productModel.updateMany({ categoryId: checkedid }, {
                status: "deactive"
            });
            req.flash('success', 'Records Successfully Deactivate.');
        } else if (activate) {
            for (let i = 0; i < checkedid.length; i++) {
                await categoryModel.findByIdAndUpdate(checkedid[i], {
                    status: "active"
                });
            }
            await subcategoryModel.updateMany({ categoryId: checkedid }, {
                status: "active"
            });
            await extrasubcategoryModel.updateMany({ categoryId: checkedid }, {
                status: "active"
            });
            await productModel.updateMany({ categoryId: checkedid }, {
                status: "active"
            });
            req.flash('success', 'Records Successfully Activate.');
        } else if (deleteCat) {
            for (let i = 0; i < checkedid.length; i++) {
                let category = await categoryModel.findById(checkedid[i]);
                if (fs.existsSync(category?.image)) {
                    fs.unlinkSync(category?.image);
                }
                let subcategory = await subcategoryModel.find({ categoryId: checkedid[i] });
                subcategory.map((subcat) => {
                    if (fs.existsSync(subcat?.image)) {
                        fs.unlinkSync(subcat?.image);
                    }
                });
                let extrasubcategory = await extrasubcategoryModel.find({ categoryId: checkedid[i] });
                extrasubcategory.map((extrasubcat) => {
                    if (fs.existsSync(extrasubcat?.image)) {
                        fs.unlinkSync(extrasubcat?.image);
                    }
                });
                let product = await productModel.find({ categoryId: checkedid[i] });
                product.map((pro) => {
                    if (fs.existsSync(pro?.image)) {
                        fs.unlinkSync(pro?.image);
                    }
                });
                await categoryModel.findByIdAndDelete(checkedid);
            }
            await subcategoryModel.deleteMany({ categoryId: checkedid });
            await extrasubcategoryModel.deleteMany({ categoryId: checkedid });
            await productModel.deleteMany({ categoryId: checkedid });
            req.flash('error', 'Records Successfully Deleted.');
        }
        return res.redirect('/dashboard/category');
    } catch (err) {
        console.log(err);
        return false;
    }
}
// subcategory start 
const subcategoryPage = async (req, res) => {
    try {
        const subcategories = await subcategoryModel.find({}).populate('categoryId');
        return res.render('dashboard/category/subcategory/view', {
            subcategories
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const createSubcategoryPage = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        const editid = req.query.editid;
        let singleSubcategory = null;
        if (editid) {
            singleSubcategory = await subcategoryModel.findById(editid).populate('categoryId');
        }
        return res.render('dashboard/category/subcategory/create', {
            category,
            singleSubcategory
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const subcategoryCrud = async (req, res) => {
    try {
        const updateid = req.query.updateid;
        const { categoryId, title, description, tags } = req.body;
        const category = await categoryModel.findById(categoryId);
        if (updateid) {
            const subcategory = await subcategoryModel.findById(updateid);
            if (req.file) {
                if (fs.existsSync(subcategory?.image)) {
                    fs.unlinkSync(subcategory?.image);
                }
                await subcategoryModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    title: title,
                    description: description,
                    image: req.file?.path,
                    tags: tags
                });
            } else {
                await subcategoryModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    title: title,
                    description: description,
                    image: subcategory?.image,
                    tags: tags
                });
            }
            req.flash('success', 'Subcategory Successfully Updated.');
            return res.redirect('/dashboard/subcategory');
        }
        await subcategoryModel.create({
            categoryId: categoryId,
            title: title,
            description: description,
            image: req.file?.path,
            tags: tags,
            status: category.status
        });
        req.flash('success', 'Subcategory Successfully Created.');
        return res.redirect('/dashboard/create_subcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const deleteSubcategory = async (req, res) => {
    try {
        const deleteid = req.query.deleteid;
        let subcategory = await subcategoryModel.findById(deleteid);
        if (fs.existsSync(subcategory?.image)) {
            fs.unlinkSync(subcategory?.image);
        }
        let extrasubcategory = await extrasubcategoryModel.find({ subcategoryId: deleteid });
        extrasubcategory.map((extrasubcat) => {
            if (fs.existsSync(extrasubcat?.image)) {
                fs.unlinkSync(extrasubcat?.image);
            }
        });
        let product = await productModel.find({ subcategoryId: deleteid });
        product.map((pro) => {
            if (fs.existsSync(pro?.image)) {
                fs.unlinkSync(pro?.image);
            }
        });
        await subcategoryModel.findByIdAndDelete(deleteid);
        await extrasubcategoryModel.deleteMany({ subcategoryId: deleteid });
        await productModel.deleteMany({ subcategoryId: deleteid });
        req.flash('error', 'Records Successfully Deleted.');
        return res.redirect('/dashboard/subcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const subCategoryStatus = async (req, res) => {
    try {
        const { statusid, status } = req.query;
        const subcategory = await subcategoryModel.findById(statusid);
        const category = await categoryModel.findById(subcategory.categoryId);
        if (status === "deactive") {
            if (category.status === 'active') {
                await subcategoryModel.findByIdAndUpdate(statusid, {
                    status: "active"
                });
                await extrasubcategoryModel.updateMany({ subcategoryId: statusid }, {
                    status: "active"
                });
                await productModel.updateMany({ subcategoryId: statusid }, {
                    status: "active"
                });
                req.flash('success', 'Subcategory Successfully Activate.');
            } else {
                await subcategoryModel.findByIdAndUpdate(statusid, {
                    status: "deactive"
                });
                req.flash('error', 'Not Allowed for Activate.');
            }
        } else {
            await subcategoryModel.findByIdAndUpdate(statusid, {
                status: "deactive"
            });
            await extrasubcategoryModel.updateMany({ subcategoryId: statusid }, {
                status: "deactive"
            });
            await productModel.updateMany({ subcategoryId: statusid }, {
                status: "deactive"
            });
            req.flash('success', 'Subcategory Successfully Deactivate.');
        }
        return res.redirect('/dashboard/subcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const changesSubcatByCheckboxes = async (req, res) => {
    try {
        const checkedid = req.body.subcategory_checkbox;
        const { deactivate, activate, deleteSubcat } = req.body;
        if (deactivate) {
            for (let i = 0; i < checkedid.length; i++) {
                await subcategoryModel.findByIdAndUpdate(checkedid[i], {
                    status: "deactive"
                });
                await extrasubcategoryModel.updateMany({ subcategoryId: checkedid }, {
                    status: "deactive"
                });
                await productModel.updateMany({ subcategoryId: checkedid }, {
                    status: "deactive"
                });
            }
            req.flash('success', 'Records Successfully Deactivate.');
        } else if (activate) {
            for (let i = 0; i < checkedid.length; i++) {
                const subcategory = await subcategoryModel.findById(checkedid[i]);
                const category = await categoryModel.findById(subcategory.categoryId);
                if (category.status == 'active') {
                    await subcategoryModel.findByIdAndUpdate(checkedid[i], {
                        status: "active"
                    });
                    await extrasubcategoryModel.updateMany({ subcategoryId: checkedid }, {
                        status: "active"
                    });
                    await productModel.updateMany({ subcategoryId: checkedid }, {
                        status: "active"
                    });
                    req.flash('success', 'Records Successfully Activate.');
                } else {
                    await subcategoryModel.findByIdAndUpdate(checkedid[i], {
                        status: "deactive"
                    });
                    req.flash('error', 'Not Allowed for Activate.');
                }
            }
        } else if (deleteSubcat) {
            for (let i = 0; i < checkedid.length; i++) {
                let subcategory = await subcategoryModel.findById(checkedid[i]);
                if (fs.existsSync(subcategory?.image)) {
                    fs.unlinkSync(subcategory?.image);
                }
                let extrasubcategory = await extrasubcategoryModel.find({ subcategoryId: checkedid[i] });
                extrasubcategory.map((extrasubcat) => {
                    if (fs.existsSync(extrasubcat?.image)) {
                        fs.unlinkSync(extrasubcat?.image);
                    }
                });
                let product = await productModel.find({ subcategoryId: checkedid[i] });
                product.map((pro) => {
                    if (fs.existsSync(pro?.image)) {
                        fs.unlinkSync(pro?.image);
                    }
                });
                await subcategoryModel.findByIdAndDelete(checkedid);
            }
            await extrasubcategoryModel.deleteMany({ subcategoryId: checkedid });
            await productModel.deleteMany({ subcategoryId: checkedid });
            req.flash('success', 'Records Successfully Deleted.');
        }
        return res.redirect('/dashboard/subcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
// extrasubcategory start 
const extarsubcategoryPage = async (req, res) => {
    try {
        const extrasubcategories = await extrasubcategoryModel.find({}).populate('categoryId').populate('subcategoryId');
        return res.render('dashboard/category/extrasubcategory/view', {
            extrasubcategories
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const createExtrasubcategoryPage = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        const subcategory = await subcategoryModel.find({});
        const editid = req.query.editid;
        let singleExtrasubcategory = null;
        if (editid) {
            singleExtrasubcategory = await extrasubcategoryModel.findById(editid).populate('categoryId').populate('subcategoryId');
        }
        return res.render('dashboard/category/extrasubcategory/create', {
            category,
            subcategory,
            singleExtrasubcategory
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const extrasubcategoryCrud = async (req, res) => {
    try {
        const updateid = req.query.updateid;
        const { categoryId, subcategoryId, title, description, tags } = req.body;
        const subcategory = await subcategoryModel.findById(subcategoryId);
        if (updateid) {
            const extrasubcategory = await extrasubcategoryModel.findById(updateid);
            if (req.file) {
                if (fs.existsSync(extrasubcategory?.image)) {
                    fs.unlinkSync(extrasubcategory?.image);
                }
                await extrasubcategoryModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    subcategoryId: subcategoryId,
                    title: title,
                    description: description,
                    image: req.file?.path,
                    tags: tags
                });
            } else {
                await extrasubcategoryModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    subcategoryId: subcategoryId,
                    title: title,
                    description: description,
                    image: extrasubcategory?.image,
                    tags: tags
                });
            }
            req.flash('success', 'Extrasubcategory Successfully Updated.');
            return res.redirect('/dashboard/extrasubcategory');
        }
        await extrasubcategoryModel.create({
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            title: title,
            description: description,
            image: req.file?.path,
            tags: tags,
            status: subcategory.status
        });
        req.flash('success', 'Extrasubcategory Successfully Created.');
        return res.redirect('/dashboard/create_extrasubcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const ajaxCategoryWiseRecord = async (req, res) => {
    try {
        let categoryid = req.query.categoryId;
        let subcategory = await subcategoryModel.find({ categoryId: categoryid }).populate('categoryId');
        return res.status(200).send({
            success: true,
            message: "record successfully fetch",
            subcategory
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}
const deleteExtrasubcategory = async (req, res) => {
    try {
        const deleteid = req.query.deleteid;
        let extrasubcategory = await extrasubcategoryModel.findById(deleteid);
        if (fs.existsSync(extrasubcategory?.image)) {
            fs.unlinkSync(extrasubcategory?.image);
        }
        let product = await productModel.find({ extrasubcategoryId: deleteid });
        product.map((pro) => {
            if (fs.existsSync(pro?.image)) {
                fs.unlinkSync(pro?.image);
            }
        });
        await extrasubcategoryModel.findByIdAndDelete(deleteid);
        await productModel.deleteMany({ extrasubcategoryId: deleteid });
        req.flash('error', 'Records Successfully Deleted.');
        return res.redirect('/dashboard/extrasubcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const extrasubcategoryStatus = async (req, res) => {
    try {
        const { statusid, status } = req.query;
        const extrasubcategory = await extrasubcategoryModel.findById(statusid);
        const subcategory = await subcategoryModel.findById(extrasubcategory.subcategoryId);
        if (status === "deactive") {
            if (subcategory.status === 'active') {
                await extrasubcategoryModel.findByIdAndUpdate(statusid, {
                    status: "active"
                });
                await productModel.updateMany({ extrasubcategoryId: statusid }, {
                    status: "active"
                });
                req.flash('success', 'Extrasubcategory Successfully Activate.');
            } else {
                await extrasubcategoryModel.findByIdAndUpdate(statusid, {
                    status: "deactive"
                });
                req.flash('error', 'Not Allowed for Activate.');
            }
        } else {
            await extrasubcategoryModel.findByIdAndUpdate(statusid, {
                status: "deactive"
            });
            await productModel.updateMany({ subcategoryId: statusid }, {
                status: "deactive"
            });
            req.flash('success', 'Extrasubcategory Successfully Deactivate.');
        }
        return res.redirect('/dashboard/extrasubcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const changesExtrasubcatByCheckboxes = async (req, res) => {
    try {
        const checkedid = req.body.extrasubcategory_checkbox;
        const { deactivate, activate, deleteExtrasubcat } = req.body;
        if (deactivate) {
            for (let i = 0; i < checkedid.length; i++) {
                await extrasubcategoryModel.findByIdAndUpdate(checkedid[i], {
                    status: "deactive"
                });
                await productModel.updateMany({ extrasubcategoryId: checkedid }, {
                    status: "deactive"
                });
            }
            req.flash('success', 'Records Successfully Deactivate.');
        } else if (activate) {
            for (let i = 0; i < checkedid.length; i++) {
                const extrasubcategory = await extrasubcategoryModel.findById(checkedid[i]);
                const subcategory = await subcategoryModel.findById(extrasubcategory.subcategoryId);
                if (subcategory.status === 'active') {
                    await extrasubcategoryModel.findByIdAndUpdate(checkedid[i], {
                        status: "active"
                    });
                    await productModel.updateMany({ extrasubcategoryId: checkedid }, {
                        status: "active"
                    });
                    req.flash('success', 'Records Successfully Activate.');
                } else {
                    await extrasubcategoryModel.findByIdAndUpdate(checkedid[i], {
                        status: "deactive"
                    });
                    req.flash('error', 'Not Allowed for Activate.');
                }
            }
        } else if (deleteExtrasubcat) {
            for (let i = 0; i < checkedid.length; i++) {
                let extrasubcategory = await extrasubcategoryModel.findById(checkedid[i]);
                if (fs.existsSync(extrasubcategory?.image)) {
                    fs.unlinkSync(extrasubcategory?.image);
                }
                let product = await productModel.find({ extrasubcategoryId: checkedid[i] });
                product.map((pro) => {
                    if (fs.existsSync(pro?.image)) {
                        fs.unlinkSync(pro?.image);
                    }
                });
                await extrasubcategoryModel.findByIdAndDelete(checkedid);
            }
            await productModel.deleteMany({ extrasubcategoryId: checkedid });
            req.flash('success', 'Records Successfully Deleted.');
        }
        return res.redirect('/dashboard/extrasubcategory');
    } catch (err) {
        console.log(err);
        return false;
    }
}
// product start 
const productPage = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('categoryId').populate('subcategoryId').populate('extrasubcategoryId');
        return res.render('dashboard/category/product/view', {
            products
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const createProductPage = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        const subcategory = await subcategoryModel.find({});
        const extrasubcategory = await extrasubcategoryModel.find({});
        const editid = req.query.editid;
        let singleProduct = null;
        if (editid) {
            singleProduct = await productModel.findById(editid).populate('categoryId').populate('subcategoryId').populate('extrasubcategoryId');
        }
        return res.render('dashboard/category/product/create', {
            category,
            subcategory,
            extrasubcategory,
            singleProduct
        });
    } catch (err) {
        console.log(err);
        return false;
    }
}
const productCrud = async (req, res) => {
    try {
        const updateid = req.query.updateid;
        const { categoryId, subcategoryId, extrasubcategoryId, title, description, tags } = req.body;
        const extrasubcategory = await extrasubcategoryModel.findById(extrasubcategoryId);
        if (updateid) {
            const product = await productModel.findById(updateid);
            if (req.file) {
                if (fs.existsSync(product?.image)) {
                    fs.unlinkSync(product?.image);
                }
                await productModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    subcategoryId: subcategoryId,
                    extrasubcategoryId: extrasubcategoryId,
                    title: title,
                    description: description,
                    image: req.file?.path,
                    tags: tags
                });
            } else {
                await productModel.findByIdAndUpdate(updateid, {
                    categoryId: categoryId,
                    subcategoryId: subcategoryId,
                    extrasubcategoryId: extrasubcategoryId,
                    title: title,
                    description: description,
                    image: product?.image,
                    tags: tags
                });
            }
            req.flash('success', 'Product Successfully Updated.');
            return res.redirect('/dashboard/product');
        }
        await productModel.create({
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            extrasubcategoryId: extrasubcategoryId,
            title: title,
            description: description,
            image: req.file?.path,
            tags: tags,
            status: extrasubcategory.status
        });
        req.flash('success', 'Product Successfully Created.');
        return res.redirect('/dashboard/create_product');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const ajaxSubcategoryWiseRecord = async (req, res) => {
    try {
        let subcategoryid = req.query.subcategoryId;
        let extrasubcategory = await extrasubcategoryModel.find({ subcategoryId: subcategoryid }).populate('subcategoryId');
        return res.status(200).send({
            success: true,
            message: "record successfully fetch",
            extrasubcategory
        })
    } catch (err) {
        console.log(err);
        return false;
    }
}
const deleteProduct = async (req, res) => {
    try {
        const deleteid = req.query.deleteid;
        let product = await productModel.findById(deleteid);
        if (fs.existsSync(product?.image)) {
            fs.unlinkSync(product?.image);
        }
        await productModel.findByIdAndDelete(deleteid);
        req.flash('error', 'Records Successfully Deleted.');
        return res.redirect('/dashboard/product');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const productStatus = async (req, res) => {
    try {
        const { statusid, status } = req.query;
        const product = await productModel.findById(statusid);
        const extrasubcategory = await extrasubcategoryModel.findById(product.extrasubcategoryId);
        if (status === "deactive") {
            if (extrasubcategory.status === "active") {
                await productModel.findByIdAndUpdate(statusid, {
                    status: "active"
                });
                req.flash('success', 'Product Successfully Activate.');
            } else {
                await productModel.findByIdAndUpdate(statusid, {
                    status: "deactive"
                });
                req.flash('error', 'Not Allowed for Activate.');
            }
        } else {
            await productModel.findByIdAndUpdate(statusid, {
                status: "deactive"
            });
            req.flash('success', 'Product Successfully Deactivate.');
        }
        return res.redirect('/dashboard/product');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const changesProductByCheckboxes = async (req, res) => {
    try {
        const checkedid = req.body.product_checkbox;
        const { deactivate, activate, deleteProduct } = req.body;
        if (deactivate) {
            for (let i = 0; i < checkedid.length; i++) {
                await productModel.findByIdAndUpdate(checkedid[i], {
                    status: "deactive"
                });
            }
            req.flash('success', 'Records Successfully Deactivate.');
        } else if (activate) {
            for (let i = 0; i < checkedid.length; i++) {
                const product = await productModel.findById(checkedid[i]);
                const extrasubcategory = await extrasubcategoryModel.findById(product.extrasubcategoryId);
                if (extrasubcategory.status === "active") {
                    await productModel.findByIdAndUpdate(checkedid[i], {
                        status: "active"
                    });
                    req.flash('success', 'Records Successfully Activate.');
                } else {
                    await productModel.findByIdAndUpdate(checkedid[i], {
                        status: "deactive"
                    });
                    req.flash('error', 'Not Allowed for Activate.');
                }
            }
        } else if (deleteProduct) {
            for (let i = 0; i < checkedid.length; i++) {
                let product = await productModel.findById(checkedid[i]);
                if (fs.existsSync(product?.image)) {
                    fs.unlinkSync(product?.image);
                }
                await productModel.findByIdAndDelete(checkedid);
            }
            req.flash('success', 'Records Successfully Deleted.');
        }
        return res.redirect('/dashboard/product');
    } catch (err) {
        console.log(err);
        return false;
    }
}
// product end 
// extrasubcategory end 
// subcategory end 
// category end
const ordersPage = async (req, res) => {
    try {
        return res.render('dashboard/orders');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const cryptocurrencyPage1 = async (req, res) => {
    try {
        return res.render('dashboard/cryptocurrency1');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const cryptocurrencyPage2 = async (req, res) => {
    try {
        return res.render('dashboard/cryptocurrency2');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const bankingPage1 = async (req, res) => {
    try {
        return res.render('dashboard/banking1');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const bankingPage2 = async (req, res) => {
    try {
        return res.render('dashboard/banking2');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const personalPage = async (req, res) => {
    try {
        return res.render('dashboard/personal');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const cmsAnalyticsPage = async (req, res) => {
    try {
        return res.render('dashboard/cms_analytics');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const influencerPage = async (req, res) => {
    try {
        return res.render('dashboard/influencer');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const travelPage = async (req, res) => {
    try {
        return res.render('dashboard/travel');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const teacherPage = async (req, res) => {
    try {
        return res.render('dashboard/teacher');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const educationPage = async (req, res) => {
    try {
        return res.render('dashboard/education');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const authorsPage = async (req, res) => {
    try {
        return res.render('dashboard/authors');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const doctorsPage = async (req, res) => {
    try {
        return res.render('dashboard/doctors');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const employeesPage = async (req, res) => {
    try {
        return res.render('dashboard/employees');
    } catch (err) {
        console.log(err);
        return false;
    }
}
const workspacesPage = async (req, res) => {
    try {
        return res.render('dashboard/workspaces');
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    dashboardPage, crmAnalyticsPage, categoryPage, createCategoryPage, categoryCrud, deleteCategory, categoryStatus, changesCatByCheckboxes, subcategoryPage, createSubcategoryPage, subcategoryCrud, deleteSubcategory, subCategoryStatus, changesSubcatByCheckboxes, extarsubcategoryPage, createExtrasubcategoryPage, extrasubcategoryCrud, ajaxCategoryWiseRecord, deleteExtrasubcategory, extrasubcategoryStatus, changesExtrasubcatByCheckboxes, productPage, createProductPage, productCrud, ajaxSubcategoryWiseRecord, deleteProduct, productStatus, changesProductByCheckboxes, ajaxPagination, ordersPage, cryptocurrencyPage1, cryptocurrencyPage2, bankingPage1, bankingPage2, personalPage, cmsAnalyticsPage, influencerPage, travelPage, teacherPage, educationPage, authorsPage, doctorsPage, employeesPage, workspacesPage
}