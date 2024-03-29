import { Datepicker  } from 'vanillajs-datepicker';
import ru from 'vanillajs-datepicker/locales/ru';
import IMask from 'imask';

Object.assign(Datepicker.locales, ru);

/*
	Vanillajs-datepicker
	https://mymth.github.io/vanillajs-datepicker/#/
*/

export default function datepicker(datepickerSelectors) {
	/*
		@param  {Element} datepickerSelectors - HTML container element, default document
	*/

	let datepickers;

	if (datepickerSelectors && typeof datepickerSelectors === 'object' && datepickerSelectors.length > 0) {
		datepickers = datepickerSelectors;
	} else {
		datepickers = document.querySelectorAll('[data-datepicker]');
	}

	if (datepickers.length) {
        const prevArrow = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.29302 5.29303C8.10555 5.48056 8.00023 5.73487 8.00023 6.00003C8.00023 6.26519 8.10555 6.5195 8.29302 6.70703L13.586 12L8.29302 17.293C8.19751 17.3853 8.12133 17.4956 8.06892 17.6176C8.01651 17.7396 7.98892 17.8709 7.98777 18.0036C7.98662 18.1364 8.01192 18.2681 8.0622 18.391C8.11248 18.5139 8.18673 18.6255 8.28063 18.7194C8.37452 18.8133 8.48617 18.8876 8.60907 18.9379C8.73196 18.9881 8.86364 19.0134 8.99642 19.0123C9.1292 19.0111 9.26042 18.9835 9.38242 18.9311C9.50443 18.8787 9.61477 18.8025 9.70702 18.707L15.707 12.707C15.8945 12.5195 15.9998 12.2652 15.9998 12C15.9998 11.7349 15.8945 11.4806 15.707 11.293L9.70702 5.29303C9.51949 5.10556 9.26518 5.00024 9.00002 5.00024C8.73486 5.00024 8.48055 5.10556 8.29302 5.29303Z"/></svg>';

        const nextArrow = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.29302 5.29303C8.10555 5.48056 8.00023 5.73487 8.00023 6.00003C8.00023 6.26519 8.10555 6.5195 8.29302 6.70703L13.586 12L8.29302 17.293C8.19751 17.3853 8.12133 17.4956 8.06892 17.6176C8.01651 17.7396 7.98892 17.8709 7.98777 18.0036C7.98662 18.1364 8.01192 18.2681 8.0622 18.391C8.11248 18.5139 8.18673 18.6255 8.28063 18.7194C8.37452 18.8133 8.48617 18.8876 8.60907 18.9379C8.73196 18.9881 8.86364 19.0134 8.99642 19.0123C9.1292 19.0111 9.26042 18.9835 9.38242 18.9311C9.50443 18.8787 9.61477 18.8025 9.70702 18.707L15.707 12.707C15.8945 12.5195 15.9998 12.2652 15.9998 12C15.9998 11.7349 15.8945 11.4806 15.707 11.293L9.70702 5.29303C9.51949 5.10556 9.26518 5.00024 9.00002 5.00024C8.73486 5.00024 8.48055 5.10556 8.29302 5.29303Z"/></svg>';

        datepickers.forEach((item) => {
            const datepicker = new Datepicker(item, {
                autohide: true,
                language: 'ru',
                prevArrow: prevArrow,
                nextArrow: nextArrow,
                maxDate: '31.12.3000'
            });

            item.addEventListener( 'changeDate', ( event ) => {
                item.classList.remove('is-error');
            } );

            IMask(item, {
                mask: '00.00.0000',
                // lazy: false,
            });
        });
    }
}





