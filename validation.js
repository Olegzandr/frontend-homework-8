document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const agreement = document.getElementById('agreement');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        clearErrors();

        let isValid = true;

        const fullnameValue = fullname.value.trim();
        const phoneValue = phone.value.trim();
        const emailValue = email.value.trim();
        const subjectValue = subject.value;
        const messageValue = message.value.trim();
        const phoneDigits = phoneValue.replace(/\D/g, '');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fullnameValue === '') {
            showError(fullname, 'Введите ФИО');
            isValid = false;
        } else {
            const words = fullnameValue.split(' ').filter(word => word.length > 0);
            if (words.length < 2) {
                showError(fullname, 'Введите минимум фамилию и имя');
                isValid = false;
            }
        }

        if (phoneValue === '') {
            showError(phone, 'Введите номер телефона');
            isValid = false;
        } else if (phoneDigits.length < 10) {
            showError(phone, 'Введите не менее 10 цифр номера');
            isValid = false;
        }

        if (emailValue === '') {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(email, 'Введите корректный email');
            isValid = false;
        }

        if (messageValue.length > 500) {
            showError(message, 'Сообщение должно быть не длиннее 500 символов');
            isValid = false;
        }

        if (!agreement.checked) {
            showCheckboxError(agreement, 'Необходимо согласие на обработку данных');
            isValid = false;
        }

        if (isValid) {
            const formData = {
                fullname: fullnameValue,
                phone: phoneValue,
                email: emailValue,
                subject: subjectValue || '(не выбрана)',
                message: messageValue || '(не заполнено)'
            };

            const customEvent = new CustomEvent('formValid', {
                detail: formData
            });

            document.dispatchEvent(customEvent);
            alert('Форма успешно отправлена! Данные выведены в консоль.');
            form.reset();
        }
    });

    [fullname, phone, email, message].forEach(input => {
        input.addEventListener('input', function () {
            removeFieldError(this);
        });
    });

    agreement.addEventListener('change', function () {
        removeCheckboxError(this);
    });

    function clearErrors() {
        document.querySelectorAll('.input.is-danger, .textarea.is-danger').forEach(el => {
            el.classList.remove('is-danger');
        });

        document.querySelectorAll('.help.is-danger.validation-error').forEach(el => {
            el.remove();
        });

        const checkboxLabel = agreement.closest('label.checkbox');
        if (checkboxLabel) {
            checkboxLabel.classList.remove('has-text-danger');
        }
    }

    function showError(input, messageText) {
        input.classList.add('is-danger');

        const error = document.createElement('p');
        error.className = 'help is-danger validation-error';
        error.textContent = messageText;

        const field = input.closest('.field');
        if (field) {
            field.appendChild(error);
        }
    }

    function showCheckboxError(checkbox, messageText) {
        const field = checkbox.closest('.field');
        const label = checkbox.closest('label.checkbox');

        if (label) {
            label.classList.add('has-text-danger');
        }

        const error = document.createElement('p');
        error.className = 'help is-danger validation-error';
        error.textContent = messageText;

        if (field) {
            field.appendChild(error);
        }
    }

    function removeFieldError(input) {
        input.classList.remove('is-danger');

        const field = input.closest('.field');
        if (!field) return;

        const error = field.querySelector('.help.is-danger.validation-error');
        if (error) {
            error.remove();
        }
    }

    function removeCheckboxError(checkbox) {
        const field = checkbox.closest('.field');
        const label = checkbox.closest('label.checkbox');

        if (label) {
            label.classList.remove('has-text-danger');
        }

        if (!field) return;

        const error = field.querySelector('.help.is-danger.validation-error');
        if (error) {
            error.remove();
        }
    }
});