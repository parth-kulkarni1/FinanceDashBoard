"use strict";
// This controller retrieves all the parentCategory and their respective child categories and returned to the front-end 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoriesHandler = void 0;
const config_1 = require("../config");
function getAllCategoriesHandler(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let responseToReturn = [];
            const data = yield config_1.up.categories.list();
            for (let i = 0; i < data.data.length; i++) {
                let currentCategoryParent = (_a = data.data[i].relationships.parent.data) === null || _a === void 0 ? void 0 : _a.id;
                let currentCategoryName = data.data[i].attributes.name;
                let currentCategoryId = data.data[i].id;
                if (i === 0) {
                    // First item scenario
                    responseToReturn.push({ parentCategory: currentCategoryParent, childCategory: [{ id: currentCategoryId, name: currentCategoryName }] });
                }
                else {
                    // Now check if the parentCategory already exists 
                    const parentCategoryIndex = responseToReturn.findIndex(item => item.parentCategory === currentCategoryParent);
                    if (parentCategoryIndex === -1) {
                        // This means that the category does not exist
                        responseToReturn.push({ parentCategory: currentCategoryParent, childCategory: [{ id: currentCategoryId, name: currentCategoryName }] });
                    }
                    else {
                        // This means that the parent category does exist 
                        (_b = responseToReturn[parentCategoryIndex].childCategory) === null || _b === void 0 ? void 0 : _b.push({ id: currentCategoryId, name: currentCategoryName });
                    }
                }
            }
            res.json(responseToReturn);
        }
        catch (err) {
            res.sendStatus(500).json({ error: 'An error occurred' });
        }
    });
}
exports.getAllCategoriesHandler = getAllCategoriesHandler;
