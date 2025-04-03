let productMenu = {
	menu: document.getElementById("productMenu"),
	controls: document.getElementById("productControl")
};
let setMenu = {
	menu: document.getElementById("setMenu"),
	controls: document.getElementById("setControl")
};
let itemMenu = {
	menu: document.getElementById("itemEditor"),
	controls: document.getElementById("itemControl")
};

let lastMenu = null;
let focusedMenu = productMenu;

function SetFocusedMenu(id)
{
	lastMenu = focusedMenu;
	lastMenu.menu.style.setProperty("display", "none");
	lastMenu.controls.style.setProperty("display", "none");

	switch(id)
	{
		case 0:
			focusedMenu = productMenu;
			break;
		case 1:
			focusedMenu = setMenu;
			break;
		case 2:
			focusedMenu = itemMenu;
			break;
	}
	
	focusedMenu.menu.style.setProperty("display", "block");
	focusedMenu.controls.style.setProperty("display", "grid");
}