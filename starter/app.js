
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
        expenseContainer: '.expenses__list'
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }else if (type === 'exp'){
                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            //insert the html into the DOM
            //insert the html as chile before the parent s
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    };

    var updateBudget = function(){

        //Calculate the budget 
        budgetCtrol.calculateBudget();

        //Return the budget
        var budget = budgetCtrol.getBudget();

        //Display the budget on the UI
        console.log(budget);
        
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

    return {
        init: function(){
            console.log('hahahah');
            setupEventListeners();
        }
    }
})(budgetController,UIController);

controller.init();