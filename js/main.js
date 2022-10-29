function Init() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        setBankHolidays(this.responseText);
    }
    xhttp.open("GET", "https://www.gov.uk/bank-holidays.json");
    xhttp.send();
}

function createBankHolidaysTable(title, englandHols, condition) {
    var clearHtml = true;
    var html = `<div class="card mt-2">
        <div class="card-header">` + title + `</div>
        <div class="card-body">`;

    html += `
    <table class="bank-holidays-table table table-striped table-collapse-phone">
        <thead>
            <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Notes</th>
            </tr>
        </thead>
    <tbody>`;
    var currentDate = new Date();

    for (i = 0; i < englandHols.events.length; i++) {
        var date = new Date(englandHols.events[i].date);
        var notes = englandHols.events[i].notes;
        date.setHours(0, 0, 0, 0);

        if (notes == null || notes == '') {
            notes = "N/A";
        }

        if (date.getFullYear() == currentDate.getFullYear() && condition(date)) {
            clearHtml = false;
            html += `
            <tr>
                <td>` + englandHols.events[i].title + `</td>
                <td><i class="fa-solid fa-calendar-days"></i> ` + formatDate(date) + `</td>
                <td><i class="fa-solid fa-note-sticky"></i> ` + notes + `</td>
            </tr>`;
        }
    }

    html += `
        </tbody>
    </table>
    </div>
    </div>`;
    if (clearHtml) {
        html = "";
    }
    return html;
}

function setBankHolidays(responseText) {
    const obj = JSON.parse(responseText);
    var englandHols = obj["england-and-wales"];

    englandHols.events.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    var bankHolidaysMainContainer = document.getElementById("bankHolidaysMainContainerId");
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    var html = createBankHolidaysTable("Future Bank Holidays", englandHols, function (date) {
        return date > currentDate;
    });
    html += createBankHolidaysTable("Bank Holidays Today", englandHols, function (date) {
        return date.toDateString() == currentDate.toDateString();
    });
    html += createBankHolidaysTable("Past Bank Holidays", englandHols, function (date) {
        return date < currentDate;
    });

    bankHolidaysMainContainer.innerHTML = html;
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }

    return day + "/" + month + '/' + year;
}