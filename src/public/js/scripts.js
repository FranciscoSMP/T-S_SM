window.onload = function () {
    const time = 1000;
    const fade = 500;

    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
        setTimeout(() => {
            successAlert.classList.add('hidden');
        }, time);
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, time + fade);
    }

    const alertOverlay = document.getElementById('auto-dismiss-alert');
    if (alertOverlay) {
        setTimeout(() => {
            alertOverlay.classList.add('fade-out');
            setTimeout(() => {
                alertOverlay.remove();
            }, 500); 
        }, 3500); // Mantiene la alerta visible por 3.5 segundos
    }
};

function setDeleteModal(desc, name, type, id) {
    document.getElementById('desc').innerText = desc;
    document.getElementById('itemName').innerText = name;
    document.getElementById('deleteForm').action = `/${type}/eliminar/${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const formAgregarUsuario = document.getElementById('formAgregarUsuario');
    
    if (formAgregarUsuario) {
        const emailInput = document.getElementById('correo_electronico');
        const passwordInput = document.getElementById('contrasenia');
        const confirmPasswordInput = document.getElementById('confirmar_contrasenia');

        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });

        formAgregarUsuario.addEventListener('submit', function(event) {
            let isValid = true;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!passwordRegex.test(passwordInput.value)) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                confirmPasswordInput.classList.remove('is-invalid');
            }

            if (!isValid) {
                event.preventDefault();
            }
        });

        [emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const formEditarUsuario = document.getElementById('formEditarUsuario');
    
    if (formEditarUsuario) {
        const emailInput = document.getElementById('correo_electronico_edit');
        const passwordInput = document.getElementById('contrasenia_edit');
        const confirmPasswordInput = document.getElementById('confirmar_contrasenia_edit');

        const toggleButtons = formEditarUsuario.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });

        formEditarUsuario.addEventListener('submit', function(event) {
            let isValid = true;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            if (passwordInput.value.trim() !== '') {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                
                if (!passwordRegex.test(passwordInput.value)) {
                    passwordInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    passwordInput.classList.remove('is-invalid');
                }

                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    confirmPasswordInput.classList.remove('is-invalid');
                }
            } else {
                passwordInput.classList.remove('is-invalid');
                confirmPasswordInput.classList.remove('is-invalid');
            }

            if (!isValid) {
                event.preventDefault();
            }
        });

        [emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    const setupProveedorValidation = (formId, emailInputId, telefonoInputId) => {
        const form = document.getElementById(formId);
        
        if (form) {
            const emailInput = document.getElementById(emailInputId);
            const telefonoInput = document.getElementById(telefonoInputId);

            telefonoInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
                this.classList.remove('is-invalid');
            });

            emailInput.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });

            form.addEventListener('submit', function(event) {
                let isValid = true;

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
                    emailInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    emailInput.classList.remove('is-invalid');
                }

                const telefonoRegex = /^\d+$/;
                if (telefonoInput.value.trim() !== '' && !telefonoRegex.test(telefonoInput.value)) {
                    telefonoInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    telefonoInput.classList.remove('is-invalid');
                }

                if (!isValid) {
                    event.preventDefault();
                }
            });
        }
    };

    setupProveedorValidation('formAgregarProveedor', 'correo_electronico', 'telefono');
    
    setupProveedorValidation('formEditarProveedor', 'correo_electronico_edit', 'telefono_edit');
});