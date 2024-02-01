const $ = document , _id = id => $.getElementById(id);

var mainPage = _id('main-page') ,
    clockText = _id('clock-txt') ,
    dateText = _id('date-txt') ,
    passName = _id('password-name') ,
    passLength = _id('password-length') ,
    choices = $.querySelectorAll('input[type="checkbox"]') ,
    password ,
    passwordText = _id('generated-password') ,
    show = _id('show-password') ,
    create = _id('create-password') ,
    copy = _id('copy-password') ,
    save = _id('save-password') ,
    dateTime ,
    nameError = _id('name-error') ,
    lengthError = _id('length-error') ,
    buttons = $.querySelectorAll('.btn') ,
    itemsList = [] ,
    alertText = _id('alerts') ,
    selectAll = _id('select-all-btn') ,
    clearAll = _id('clear-all-btn') ,
    item ,
    userTitle ,
    userPass ,
    showDelBtnBox ,
    showBtn ,
    delBtn ,
    secondPasswordsList = [] ,
    menu = _id('menu') ,
    menuLineOne = _id('line-1') ,
    menuLineTwo = _id('line-2') ,
    menuLineThree = _id('line-3') ,
    passwordsPage = _id('passwords-page') ,
    title = _id('title') ,
    chUpper = _id('upper') ,
    chLower = _id('lower') ,
    chSymbol = _id('symbol') ,
    chNumber = _id('number') ,
    chSpace = _id('space') ,
    upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' ,
    lower = upper.toLowerCase() ,
    symbol = ':;`~!@#$%^&*()_-+=\\|{}[]<.>,?/\'' ,
    number = '0123456789' ,
    space = ' ';

chUpper.setAttribute('value' , upper) , chLower.setAttribute('value' , lower) , chSymbol.setAttribute('value' , symbol) , chNumber.setAttribute('value' , number) , chSpace.setAttribute('value' , space);

(localStorage.getItem('Passwords') == null ? localStorage.setItem('Passwords' , JSON.stringify([])) : null);

var passwordsList = JSON.parse(localStorage.getItem('Passwords'));

setInterval(() => {
    dateTime = new Date();
    let h = dateTime.getHours() , m = dateTime.getMinutes() , s = dateTime.getSeconds();
    (h <= 9 ? h = `0${h}` : null);
    (m <= 9 ? m = `0${m}` : null);
    (s <= 9 ? s = `0${s}` : null);
    dateText.textContent = `${dateTime.getFullYear()}/${dateTime.getMonth() + 1}/${dateTime.getDate()}`;
    clockText.textContent = `${h}:${m}:${s}`;
} , 500);
passName.addEventListener('input' , event => {
    (event.target.value.length >= 1 ? nameError.style.display = 'none' : nameError.style.display = 'block');
    checkInputs();
});
passLength.addEventListener('input' , event => {
    (event.target.value.length >= 1 ? lengthError.style.display = 'none' : lengthError.style.display = 'block');
    checkInputs();
});
choices.forEach(choice => {choice.addEventListener('change' , () => checkInputs());});
window.addEventListener('keypress' , event => (event.keyCode == 13 ? createPassword() : null));
function checkInputs () {
    ((passName.value.length >= 1 || passLength.value.length >= 1 || (chUpper.checked || chLower.checked || chSymbol.checked || chNumber.checked || chSpace.checked)) ? clearAll.style.display = 'flex' : clearAll.style.display = '');
    ((passName.value.length >= 1 && passLength.value.length >= 1 && (chUpper.checked || chLower.checked || chSymbol.checked || chNumber.checked || chSpace.checked)) ? create.classList.replace('inactive-btn' , 'active-btn') : create.classList.replace('active-btn' , 'inactive-btn'));
};
function activeButtons () {
    buttons.forEach(btn => {
        btn.classList.replace('inactive-btn' , 'active-btn');
    });
};
function inactiveButtons () {
    buttons.forEach(btn => {
        btn.classList.replace('active-btn' , 'inactive-btn');
    });
};
function copiedAlert () {
    alertText.style.display = 'block';
    alertText.textContent = 'Copied !';
    setTimeout(() => {
        alertText.style.display = 'none';
        alertText.textContent = '';
    } , 2500);
};
function savedAlert () {
    alertText.style.display = 'block';
    alertText.textContent = 'Saved !';
    setTimeout(() => {
        alertText.style.display = 'none';
        alertText.textContent = '';
    } , 2500);
};
function openMenu () {
    let html = $.querySelector('html');
    html.style.height = 'max-content';
    if (Number(getComputedStyle(html).width.replace('px' , '')) <= 850) {
        html.style.overflow = 'scroll';
    }
    title.textContent = 'Saved Passwords';
    menu.dataset.openclose = 'open';
    mainPage.style.display = 'none';
    _id('credit').style.display = 'none';
    passwordsPage.style.display = 'flex';
    menuLineTwo.style.transform = 'scale(0)';
    menuLineOne.classList.toggle('close-line');
    menuLineThree.classList.toggle('close-line');
    menuLineOne.style.transform = 'rotate(45deg)';
    menuLineThree.style.transform = 'rotate(-45deg)';
    menu.title = 'Close';
    addPasswordsToDOM();
};
function closeMenu () {
    let html = $.querySelector('html');
    html.style.height = '';
    if (Number(getComputedStyle(html).width.replace('px' , '')) <= 850) {
        html.style.overflow = '';
    }
    title.textContent = 'Password Generator';
    menu.dataset.openclose = 'close';
    passwordsPage.style.display = '';
    mainPage.style.display = '';
    _id('credit').style.display = '';
    setTimeout(() => {menuLineTwo.style.transform = ''} , 100);
    menuLineOne.classList.toggle('close-line');
    menuLineThree.classList.toggle('close-line');
    menuLineOne.style.transform = '';
    menuLineThree.style.transform = '';
    menu.title = 'Saved Passwords';
};
function addPasswordsToDOM () {
    children = [...passwordsPage.children];
    children.forEach(child => child.remove());
    passwordsList.forEach(child => {
        item = $.createElement('div');
        item.classList.add('item');
        userTitle = $.createElement('p');
        userTitle.classList.add('password-name-text');
        userTitle.textContent = child.Title;
        userPass = $.createElement('input');
        userPass.classList.add('password-text');
        userPass.type = 'password';
        userPass.setAttribute('disabled' , true);
        userPass.setAttribute('value' , child.Password);
        showDelBtnBox = $.createElement('div');
        showDelBtnBox.classList.add('show-delete-btn');
        showBtn = $.createElement('button');
        showBtn.classList.add('btn' , 'show-btn');
        showBtn.textContent = 'Show';
        showBtn.setAttribute('title' , 'Show Password');
        showBtn.addEventListener('click' , event => {
            if (event.target.textContent == 'Show') {
                event.target.parentElement.previousElementSibling.type = 'text';
                event.target.textContent = 'Hide';
            } else {
                event.target.parentElement.previousElementSibling.type = 'password';
                event.target.textContent = 'Show';
            }
        });
        delBtn = $.createElement('button');
        delBtn.classList.add('btn' , 'delete-btn');
        delBtn.textContent = 'Delete';
        delBtn.setAttribute('title' , 'Delete Password');
        delBtn.addEventListener('click' , event => {
            passwordsPage.removeChild(event.target.parentElement.parentElement);
            deletePassword(event.target.parentElement.previousElementSibling.previousElementSibling.textContent , event.target.parentElement.previousElementSibling.value);
        });
        showDelBtnBox.append(showBtn , delBtn);
        item.append(userTitle , userPass , showDelBtnBox);
        passwordsPage.append(item);
    });
};
function deletePassword (passTitle , passValue) {
    secondPasswordsList = [];
    secondPasswordsList = passwordsList.filter(userPassAndTitle => {return (userPassAndTitle.Title != passTitle && userPassAndTitle.Password != passValue);});
    passwordsList = secondPasswordsList;
    localStorage.setItem('Passwords' , JSON.stringify(passwordsList));
};
function createPassword () {
    if (create.classList.contains('active-btn')) {
        password = '';
        itemsList = [];
        let item;
        choices.forEach(choice => {
            (choice.checked ? itemsList.push(choice.value) : null);
        });
        for (let i = 0; i < passLength.value; i++) {
            item = itemsList[Math.trunc(Math.random() * itemsList.length)];
            password += item[Math.trunc(Math.random() * item.length)];
        }
        passwordText.classList.remove('inactive-btn');
        passwordText.value = password;
        copy.classList.replace('inactive-btn' , 'active-btn');
        show.classList.replace('inactive-btn' , 'active-btn');
        save.style.display = 'flex';
    }
};
menu.addEventListener('click' , () => (menu.dataset.openclose == 'close' ? openMenu() : closeMenu()));
create.addEventListener('click' , createPassword);
save.addEventListener('click' , () => {
    save.style.display = '';
    passwordsList.push({Title: passName.value , Password: password});
    localStorage.setItem('Passwords' , JSON.stringify(passwordsList));
    savedAlert();
});
show.addEventListener('click' , () => {
    if (show.classList.contains('active-btn')) {
        (passwordText.type == 'password' ? (passwordText.type = 'text' , show.textContent = 'Hide') : (passwordText.type = 'password' , show.textContent = 'Show'))
    }
});
copy.addEventListener('click' , () => {
    if (copy.classList.contains('active-btn')) {
        navigator.clipboard.writeText(passwordText.value);
        copiedAlert();
    }
});
selectAll.addEventListener('click' , () => {
    if (selectAll.textContent == 'Select All') {
        selectAll.classList.toggle('active');
        choices.forEach(choice => {
            choice.checked = true;
        });
        selectAll.textContent = 'Unselect All';
    } else {
        selectAll.classList.toggle('active');
        choices.forEach(choice => {
            choice.checked = false;
        });
        selectAll.textContent = 'Select All';
    }
    checkInputs();
});
clearAll.addEventListener('click' , () => {
    passName.value = '';
    passLength.value = '';
    choices.forEach(choice => choice.checked = false);
    passwordText.value = '';
    save.style.display = '';
    selectAll.classList.replace('active' , 'inactive');
    selectAll.textContent = 'Select All';
    passwordText.classList.add('inactive-btn');
    passwordText.type = 'password';
    show.textContent = 'Show';
    inactiveButtons();
    save.classList.replace('inactive-btn' , 'active-btn');
    checkInputs();
});