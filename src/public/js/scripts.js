window.onload = function () {

    var time = 1000;
    var fade = 500;

    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
        setTimeout(() => {
            successAlert.classList.add('hidden');
        }, time);

        setTimeout(() => {
            successAlert.style.display = 'none';
        }, time + fade);
    }
};

function setDeleteModal(desc, name, type, id) {
    document.getElementById('desc').innerText = desc;
    document.getElementById('itemName').innerText = name;
    document.getElementById('deleteForm').action = `/${type}/eliminar/${id}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formAgregarUsuario');
    const contrasenia = document.getElementById('contrasenia');
    const confirmar = document.getElementById('confirmar_contrasenia');
    const mensajeError = document.getElementById('mensajeError');

    form.addEventListener('submit', function (e) {
        if (contrasenia.value !== confirmar.value) {
            e.preventDefault(); // Evita el envío del formulario
            mensajeError.style.display = 'block';
            confirmar.classList.add('is-invalid');
        } else {
            mensajeError.style.display = 'none';
            confirmar.classList.remove('is-invalid');
        }
    });

    confirmar.addEventListener('input', function () {
        if (contrasenia.value === confirmar.value) {
            mensajeError.style.display = 'none';
            confirmar.classList.remove('is-invalid');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});
