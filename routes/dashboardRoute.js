const express = require('express');
const routes = express.Router();

const { dashboardPage, crmAnalyticsPage, categoryPage, createCategoryPage, categoryCrud, deleteCategory, categoryStatus, changesCatByCheckboxes, subcategoryPage, createSubcategoryPage, subcategoryCrud, deleteSubcategory, subCategoryStatus, changesSubcatByCheckboxes, extarsubcategoryPage, createExtrasubcategoryPage, extrasubcategoryCrud, ajaxCategoryWiseRecord, deleteExtrasubcategory, extrasubcategoryStatus, changesExtrasubcatByCheckboxes, productPage, createProductPage, productCrud, ajaxSubcategoryWiseRecord, deleteProduct, productStatus, changesProductByCheckboxes, ajaxPagination, ordersPage, cryptocurrencyPage1, cryptocurrencyPage2, bankingPage1, bankingPage2, personalPage, cmsAnalyticsPage, influencerPage, travelPage, teacherPage, educationPage, authorsPage, doctorsPage, employeesPage, workspacesPage } = require('../controllers/DashboardController');

const fileUpload = require("../config/multer");

routes.get('/', dashboardPage);
routes.get('/crm_analytics', crmAnalyticsPage);
// category start
routes.get('/category', categoryPage);
routes.get('/create_category', createCategoryPage);
routes.post('/category_crud', fileUpload.single('category_image'), categoryCrud);
routes.get('/delete_category', deleteCategory);
routes.get('/category_status', categoryStatus);
routes.post('/changes_cat_by_checkboxes', changesCatByCheckboxes);
// subcategory start 
routes.get('/subcategory', subcategoryPage);
routes.get('/create_subcategory', createSubcategoryPage);
routes.post('/subcategory_crud', fileUpload.single('subcategory_image'), subcategoryCrud);
routes.get('/delete_subcategory', deleteSubcategory);
routes.get('/subcategory_status', subCategoryStatus);
routes.post('/changes_subcat_by_checkboxes', changesSubcatByCheckboxes);
// extrasubcategory start 
routes.get('/extrasubcategory', extarsubcategoryPage);
routes.get('/create_extrasubcategory', createExtrasubcategoryPage);
routes.post('/extrasubcategory_crud', fileUpload.single('extrasubcategory_image'), extrasubcategoryCrud);
routes.get('/ajax_category_wise_record', ajaxCategoryWiseRecord);
routes.get('/delete_extrasubcategory', deleteExtrasubcategory);
routes.get('/extrasubcategory_status', extrasubcategoryStatus);
routes.post('/changes_extrasubcat_by_checkboxes', changesExtrasubcatByCheckboxes);
// product start 
routes.get('/product', productPage);
routes.get('/create_product', createProductPage);
routes.post('/product_crud', fileUpload.single('product_image'), productCrud);
routes.get('/ajax_subcategory_wise_record', ajaxSubcategoryWiseRecord);
routes.get('/delete_product', deleteProduct);
routes.get('/product_status', productStatus);
routes.post('/changes_product_by_checkboxes', changesProductByCheckboxes);
// product end 
// extrasubcategory end 
// subcategory end 
// category end
// pagination start 
routes.get('/ajax_pagination',ajaxPagination);
// pagination end 
routes.get('/orders', ordersPage);
routes.get('/cryptocurrency1', cryptocurrencyPage1);
routes.get('/cryptocurrency2', cryptocurrencyPage2);
routes.get('/banking1', bankingPage1);
routes.get('/banking2', bankingPage2);
routes.get('/personal', personalPage);
routes.get('/cms_analytics', cmsAnalyticsPage);
routes.get('/influencer', influencerPage);
routes.get('/travel', travelPage);
routes.get('/teacher', teacherPage);
routes.get('/education', educationPage);
routes.get('/authors', authorsPage);
routes.get('/doctors', doctorsPage);
routes.get('/employees', employeesPage);
routes.get('/workspaces', workspacesPage);

module.exports = routes;