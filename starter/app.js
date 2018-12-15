
//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.total[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem;

            //create new ID
            //the ID of the last item in array exp or inc of the allItems + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            

            //CREATE new item 
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //push it into data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(cur){
                return cur.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: inc - exp

            data.budget = data.total.inc - data.total.exp;

            //calculate the percentage of income that we spend
            if(data.total.inc>0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }else{
                data.percentage = -1;
            }
            
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
            
        }
    };
})();

//UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputdescription: '.add__description',
        inputvalue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percenetageLabel: '.budget__expenses--percentage',
        continer: '.container'
    };
    //return an object
    return {
        getinput: function(){
            //return the property
            return{
                type : document.querySelector(DOMstrings.inputType).value,// inc or exp
                description : document.querySelector(DOMstrings.inputdescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputvalue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            //create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }else if (type === 'exp'){
                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            //insert the html into the DOM
            //insert the html as chile before the parent s
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);

            //DOM only allow to remove child of parent
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fileds, fieldsArr;

            fileds = document.querySelectorAll(DOMstrings.inputdescription + ',' + DOMstrings.inputvalue);  
            fieldsArr = Array.prototype.slice.call(fileds);

            fieldsArr.forEach(function(cur,index,arr) {
                cur.value = "";
            });

            fieldsArr[0].focus();//return the cursor back to focus the filed
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
          
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percenetageLabel).textContent = obj.percentage;
            }else{
                document.querySelector(DOMstrings.percenetageLabel).textContent = '---';
            }
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

//GLOBAL APP CONTROLLER 
var controller = (function(budgetCtrol, UICtrl) {

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.continer).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        //Calculate the budget 
        budgetCtrol.calculateBudget();

        //Return the budget
        var budget = budgetCtrol.getBudget();

        //Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };

    var ctrlAddItem = function(){
        var input, newItem;
        //Get the filed input data
        input = UICtrl.getinput();

        if(input.description !=="" && !isNaN(input.value) && input.value > 0){
            //Add the item to the budget controller
            newItem = budgetCtrol.addItem(input.type,input.description,input.value);

            //Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //Clear the field
            UICtrl.clearFields();

            //Calculate and update budget
            updateBudget();
        }
        
    };

    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id; // target to the parent element 
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete the item from the data structure
            budgetController.deleteItem(type, ID);

            //Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //Update and show the new budget
            updateBudget();
        }
    };

    return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
})(budgetController,UIController);

controller.init();