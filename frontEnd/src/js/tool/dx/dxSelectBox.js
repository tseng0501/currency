'use strict';
/** DevExtreme SelectBox 設定格式 */

class DxSelectBoxOptions {
    /**
    * @param {Object}  options                  設定
    * @param {Array.<{}>}  options.dataSource   SelectBox 資料來源
    * @param {String}  options.searchEnabled    是否允許搜索
    * @param {String}  options.placeholder      預設文字提醒
    * @param {Function}  options.onValueChanged UI 組件的值更改後執行的函數
    * @param {String}  options.displayExpr      指定應顯示其值的數據字段
    * @param {String}  options.valueExpr        指定哪個數據字段為 UI 組件的值提供唯一值
    * @param {String}  options.value        指定哪個數據字段為 UI 組件的值提供唯一值
    * 
    **/

    constructor(options = {}) {
        this.dataSource = (options.dataSource || []);
        this.placeholder = (options.placeholder || '請選擇...');
        this.searchEnabled = (options.searchEnabled || true);

        this.onValueChanged = (options.onValueChanged || null);
        this.displayExpr = (options.displayExpr || '');
        this.valueExpr = (options.valueExpr || '');
        this.value = (options.value || '');

    }
}

/** 繪製 DevExtreme SelectBox
 * @param {jQuery}              $panel  被繪製的jQuery元件
 * @param {DxSelectBoxOptions}  options DevExtreme SelectBox 設定資訊
 * @returns 如果錯誤回傳false
 */

function DrawSelectBox($panel, options) {
    if ($panel === null) {
        console.log('缺少 $panel.');
        return false;
    }
    $panel.dxSelectBox({
        dataSource: (typeof options.dataSource === 'function' ? options.dataSource() : options.dataSource),
        placeholder: options.placeholder,
        onValueChanged: options.onValueChanged,
        searchEnabled: options.searchEnabled,
        displayExpr: options.displayExpr,
        valueExpr: options.valueExpr,
        value: options.value
    })
    return $panel;
}

export { DrawSelectBox, DxSelectBoxOptions }
