import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';
import {flyInOut, expand} from '../animations/app.animation';
import {FeedbackService} from '../services/feedback.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(), expand()
  ]
})
export class ContactComponent implements OnInit {

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };
  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  submittedFeedback: Feedback;
  feedbackErrMess: string;
  hideFrom = false;
  @ViewChild('fform') feedbackFormDirective;
  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.hideFrom = true;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
      this.feedbackService.submitFeedback(this.feedback).subscribe(feedBACK => { this.submittedFeedback = feedBACK;
        setTimeout(() => {
          this.submittedFeedback = null;
          this.hideFrom = false;
          this.feedbackErrMess = null;
          this.feedbackForm.reset({
            firstname: '',
            lastname: '',
            telnum: '',
            email: '',
            agree: false,
            contacttype: 'None',
            message: ''
          });
          this.feedbackFormDirective.resetForm();
        }, 5000); },
        errmess => { this.feedbackErrMess = <any>errmess;
        setTimeout(() => {
          this.hideFrom = false;
          this.feedbackErrMess = null;
          this.feedbackForm.reset({
            firstname: '',
            lastname: '',
            telnum: '',
            email: '',
            agree: false,
            contacttype: 'None',
            message: ''
          });
          this.feedbackFormDirective.resetForm();
        }, 5000); });
    }

}