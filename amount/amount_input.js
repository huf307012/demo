function amountInput(parent,child) {
    var CashingAmountLast = "";

    $moneyInput = ""; //动态添加了内容  要用事件委托方式绑定下面的事件

    function checkCode(code) {
        var codeArea = code > 57 && code < 96;
        if (!(code == 190 || code == 110 || code == 46 || code == 8 || code == 37 || code == 39)) {
            if (codeArea || code < 48 || code > 105) {
                return false;
            }
        }
        return true;
    }
    
    $(parent).on("keydown", child, function(e) {
        var code = e.keyCode,
            val = e.target.value;
        if (val.indexOf(".") > -1 && (code == 190 || code == 110)) {
            e.target.value = val;
            return false;
        }
        if (!checkCode(code)) {
            return false;
        }
        this.setAttribute("data-keyCode", code);
        return true;
    }).on("input",child, function(e) {
        var val = this.value,
            keyCode = this.getAttribute("data-keyCode"),
            reSet = false;
        if (e.currentTarget.validity.valid) {
            if (val.indexOf(".") < 0 && (keyCode == 190 || keyCode == 110)) {
                val += ".";
            }
        } else {
            val = CashingAmountLast;
            if ((keyCode == 190 || keyCode == 110) && val.indexOf(".") < 0) {
                val = Number(CashingAmountLast).toFixed(1);
            }
            reSet = true;
        }
        fixCashFn.call(this,val, reSet);
    }).on("blur", child,function(e) {
        var val = Number($(this).val());
        if (!isNaN(val)) {
            e.target.value = val;
        } else {
            e.target.value = 0;
        }
    });

    function fixCashFn(a, isReset) {
        let money = typeof a === "string" ? a : a.toString(),
            flag = false,
            valArr = [],
            _slef = this;
        money = money.replace(/\s/g, "");
        var strLen = money.length;
        if (isNaN(Number(money))) {
            flag = true;
        } else if (strLen > 0) {
            //保留至多两个小数点的数字
            if (!/^\d+(?:\.\d{1,2})?$/.test(money) && money.charAt(strLen - 1) !== ".") {
                flag = true;
            }
        }
        if (flag) {
            money = CashingAmountLast;
        }
        if (isNaN(Number(money))) {
            money = "";
        }
        (function() {
            if (money.length > 0) {
                valArr = money.split(".");
                money = Number(valArr[0]).toString().slice(0, 10);
                if (valArr.length > 1) {
                    money += "." + valArr[1].slice(0, 2);
                }
            }
            if (money.charAt(money.length - 1) !== ".") {
                if (a !== money) {
                    $(_slef).val(money);
                    CashingAmountLast = money;
                } else {
                    CashingAmountLast = a;
                }
            }
            if (isReset) {
                $(_slef).val(money);
            }
        })();
    }
}
