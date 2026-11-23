// =====================================================
// GET HTML ELEMENTS
// =====================================================

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const taskTime =
    document.getElementById("taskTime");

const taskPriority =
    document.getElementById("taskPriority");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const searchInput =
    document.getElementById("searchInput");

const taskList =
    document.getElementById("taskList");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const darkModeToggle =
    document.getElementById("darkModeToggle");


// =====================================================
// TASK DATA
// =====================================================

let tasks = [];

let currentFilter = "all";


// =====================================================
// ADD TASK
// =====================================================

addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    const task = {

        id: Date.now(),

        text: text,

        date: taskDate.value,

        time: taskTime.value,

        priority: taskPriority.value,

        completed: false

    };


    tasks.push(task);


    // Clear inputs

    taskInput.value = "";

    taskDate.value = "";

    taskTime.value = "";

    taskPriority.value = "medium";


    displayTasks();

}


// =====================================================
// DISPLAY TASKS
// =====================================================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    // Status filter

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );

    }


    // Important filter

    if (currentFilter === "important") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.priority === "high"
            );

    }


    // Search

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchText !== "") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.text
                        .toLowerCase()
                        .includes(searchText)
            );

    }


    // Empty message

    if (filteredTasks.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";

    }


    // Create task cards

    filteredTasks.forEach(function (task) {

        const card =
            document.createElement("div");


        card.className =
            `task-card ${task.priority}`;


        if (task.completed) {

            card.classList.add(
                "completed"
            );

        }


        // Deadline

        let deadline =
            "No deadline";


        if (task.date || task.time) {

            deadline = "";


            if (task.date) {

                deadline +=
                    formatDate(
                        task.date
                    );

            }


            if (task.time) {

                deadline +=
                    " " +
                    formatTime(
                        task.time
                    );

            }

        }


        // Priority text

        const priorityText =
            task.priority
                .charAt(0)
                .toUpperCase() +
            task.priority.slice(1);


        card.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >


            <div class="task-information">

                <div class="task-name">
                    ${escapeHTML(task.text)}
                </div>


                <div class="task-details">

                    <span>
                        📅 Due: ${deadline}
                    </span>


                    <span
                        class="priority ${task.priority}">
                        ● ${priorityText}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✎
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑
                </button>

            </div>

        `;


        // Checkbox event

        const checkbox =
            card.querySelector(
                ".task-checkbox"
            );


        checkbox.addEventListener(
            "change",
            function () {

                toggleTask(
                    task.id
                );

            }
        );


        taskList.appendChild(
            card
        );

    });


    updateStatistics();

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(timeString) {

    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date();


    date.setHours(
        hours
    );

    date.setMinutes(
        minutes
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );

}


// =====================================================
// COMPLETE TASK
// =====================================================

function toggleTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    displayTasks();

}


// =====================================================
// EDIT TASK
// =====================================================

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) {

        return;

    }


    const newText =
        prompt(
            "Edit task:",
            task.text
        );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text =
            newText.trim();

        displayTasks();

    }

}


// =====================================================
// DELETE TASK
// =====================================================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    displayTasks();

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total -
        completed;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;


    // Notification count

    const notificationCount =
        document.querySelector(
            ".notification-count"
        );


    notificationCount.textContent =
        pending;

}


// =====================================================
// FILTER BUTTONS
// =====================================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                currentFilter =
                    this.dataset.filter;


                displayTasks();

            }
        );

    }
);


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    function () {

        displayTasks();

    }
);


// =====================================================
// SIDEBAR NAVIGATION
// =====================================================

const navItems =
    document.querySelectorAll(
        ".nav-item[data-filter]"
    );


navItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                navItems.forEach(
                    nav => {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                currentFilter =
                    this.dataset.filter;


                displayTasks();

            }
        );

    }
);


// =====================================================
// TODAY BUTTON
// =====================================================

document
    .getElementById("todayBtn")
    .addEventListener(
        "click",
        function () {

            navItems.forEach(
                nav =>
                    nav.classList.remove(
                        "active"
                    )
            );


            this.classList.add(
                "active"
            );


            showTodayTasks();

        }
    );


function showTodayTasks() {

    taskList.innerHTML = "";


    const today =
        new Date();


    const todayString =
        today.toISOString()
            .split("T")[0];


    const todayTasks =
        tasks.filter(
            task =>
                task.date ===
                todayString
        );


    if (todayTasks.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    todayTasks.forEach(
        task =>
            createTodayTask(task)
    );

}


function createTodayTask(task) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        `task-card ${task.priority}`;


    if (task.completed) {

        card.classList.add(
            "completed"
        );

    }


    card.innerHTML = `

        <input
            type="checkbox"
            class="task-checkbox"
            ${task.completed ? "checked" : ""}
        >

        <div class="task-information">

            <div class="task-name">
                ${escapeHTML(task.text)}
            </div>

            <div class="task-details">

                <span>
                    📅 Today ${formatTime(task.time)}
                </span>

                <span class="priority ${task.priority}">
                    ● ${task.priority}
                </span>

            </div>

        </div>

        <div class="task-actions">

            <button
                class="edit-btn"
                onclick="editTask(${task.id})">
                ✎
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">
                🗑
            </button>

        </div>

    `;


    card
        .querySelector(
            ".task-checkbox"
        )
        .addEventListener(
            "change",
            function () {

                toggleTask(
                    task.id
                );

            }
        );


    taskList.appendChild(
        card
    );

}


// =====================================================
// IMPORTANT BUTTON
// =====================================================

document
    .getElementById(
        "importantBtn"
    )
    .addEventListener(
        "click",
        function () {

            currentFilter =
                "important";


            filterButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            const importantFilter =
                document.querySelector(
                    '[data-filter="important"]'
                );


            importantFilter.classList.add(
                "active"
            );


            displayTasks();

        }
    );


// =====================================================
// DARK MODE
// =====================================================

darkModeToggle.addEventListener(
    "change",
    function () {

        if (this.checked) {

            document.body.classList.add(
                "dark"
            );

        } else {

            document.body.classList.remove(
                "dark"
            );

        }

    }
);


// =====================================================
// NOTIFICATION BUTTON
// =====================================================

document
    .getElementById(
        "notificationBtn"
    )
    .addEventListener(
        "click",
        function () {

            const pending =
                tasks.filter(
                    task =>
                        !task.completed
                ).length;


            alert(
                `You have ${pending} pending task(s).`
            );

        }
    );


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// =====================================================
// INITIAL LOAD
// =====================================================

displayTasks();