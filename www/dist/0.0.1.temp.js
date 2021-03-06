(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/templates/tabs.html',
    '<ion-tabs class="tabs-stable tabs-icon-top tabs-color-positive" ng-cloak>\n' +
    '\n' +
    '  <ion-tab title="Favorites" icon-off="ion-ios-star-outline" icon-on="ion-ios-star" href="#/tab/favorites">\n' +
    '    <ion-nav-view name="tab-favorites"></ion-nav-view>\n' +
    '  </ion-tab>\n' +
    '\n' +
    '  <ion-tab title="Recents" icon-off="ion-ios-clock-outline" icon-on="ion-ios-clock" href="#/tab/recents">\n' +
    '    <ion-nav-view name="tab-recents"></ion-nav-view>\n' +
    '  </ion-tab>\n' +
    '\n' +
    '  <ion-tab title="Contacts" icon-off="ion-ios-person-outline" icon-on="ion-ios-person" href="#/tab/contacts">\n' +
    '    <ion-nav-view name="tab-contacts"></ion-nav-view>\n' +
    '  </ion-tab>\n' +
    '\n' +
    '  <ion-tab title="Chats" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes" href="#/tab/chats">\n' +
    '    <ion-nav-view name="tab-chats"></ion-nav-view>\n' +
    '  </ion-tab>\n' +
    '\n' +
    '  <ion-tab title="Settings" icon-off="ion-ios-cog-outline" icon-on="ion-ios-cog" href="#/tab/settings">\n' +
    '    <ion-nav-view name="tab-settings"></ion-nav-view>\n' +
    '  </ion-tab>\n' +
    '\n' +
    '</ion-tabs>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/chat/chat-detail.html',
    '<ion-view title="{{chat | chatName}}">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button class="button button-clear"><img class="header-picture" ng-src="{{chat | chatPicture}}"></button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content class="chat" delegate-handle="chatScroll">\n' +
    '    <div class="message-list">\n' +
    '      <div ng-repeat="message in messages" class="message-wrapper">\n' +
    '       <div class="message" ng-class="message.userId === $root.currentUser._id ? \'message-mine\' : \'message-other\'">\n' +
    '          <div class="message-text">{{message.text}}</div>\n' +
    '          <span class="message-timestamp">{{message.timestamp | amDateFormat: \'HH:MM\'}}</span>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '\n' +
    '  <ion-footer-bar keyboard-attach class="bar-stable footer-chat item-input-inset">\n' +
    '    <button class="button button-clear button-icon button-positive icon ion-ios-upload-outline"></button>\n' +
    '\n' +
    '    <label class="item-input-wrapper">\n' +
    '      <input\n' +
    '        ng-model="data.message"\n' +
    '        on-return="sendMessage(); closeKeyboard()"\n' +
    '        on-focus="inputUp()"\n' +
    '        on-blur="inputDown()"\n' +
    '        dir="auto"\n' +
    '        type="text"/>\n' +
    '    </label>\n' +
    '\n' +
    '    <span ng-if="data.message.length > 0">\n' +
    '      <button ng-click="sendMessage()" class="button button-clear button-positive">Send</button>\n' +
    '    </span>\n' +
    '    <span ng-if="!data.message || data.message.length === 0">\n' +
    '      <button class="button button-clear button-icon button-positive icon ion-ios-camera-outline"></button>\n' +
    '      <i class="buttons-seperator icon ion-android-more-vertical"></i>\n' +
    '      <button class="button button-clear button-icon button-positive icon ion-ios-mic-outline"></button>\n' +
    '    </span>\n' +
    '  </ion-footer-bar>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/chat/new-chat.html',
    '<ion-modal-view ng-controller="NewChatCtrl">\n' +
    '  <ion-header-bar>\n' +
    '    <h1 class="title">New Chat</h1>\n' +
    '    <div class="buttons">\n' +
    '      <button class="button button-clear button-positive" ng-click="hideModal()">Cancel</button>\n' +
    '    </div>\n' +
    '  </ion-header-bar>\n' +
    '\n' +
    '  <ion-content>\n' +
    '    <div class="list">\n' +
    '      <a ng-repeat="user in users" ng-click="newChat(user._id)" class="item">\n' +
    '        <h2>{{user.profile.name}}</h2>\n' +
    '        <p>\n' +
    '          Hey there! I am using ionic-Whatsapp with meteor.\n' +
    '        </p>\n' +
    '      </a>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-modal-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/chat/tab-chats.html',
    '<ion-view view-title="Chats">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button ng-click="openNewChatModal()" class="button button-clear button-positive button-icon ion-ios-compose-outline"></button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content>\n' +
    '    <ion-list>\n' +
    '      <ion-item\n' +
    '        ng-repeat="chat in chats | orderBy:\'-lastMessage.timestamp\'"\n' +
    '        class="item-chat item-remove-animate item-avatar item-icon-right"\n' +
    '        type="item-text-wrap"\n' +
    '        href="#/tab/chats/{{chat._id}}">\n' +
    '        <img ng-src="{{chat | chatPicture}}">\n' +
    '        <h2>{{chat | chatName}}</h2>\n' +
    '        <p>{{chat.lastMessage.text}}</p>\n' +
    '        <span class="last-message-timestamp">{{chat.lastMessage.timestamp | calendar}}</span>\n' +
    '        <i class="icon ion-chevron-right icon-accessory"></i>\n' +
    '\n' +
    '        <ion-option-button class="button-assertive" ng-click="remove(chat)">\n' +
    '          Delete\n' +
    '        </ion-option-button>\n' +
    '      </ion-item>\n' +
    '    </ion-list>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/contact/tab-contacts.html',
    '<ion-view view-title="Contacts">\n' +
    '  <ion-content>\n' +
    '    <ion-list>\n' +
    '      <ion-item\n' +
    '        ng-repeat="user in users"\n' +
    '        class="item-chat item-remove-animate item-avatar item-icon-right"\n' +
    '        type="item-text-wrap"\n' +
    '        ng-click="newChat(user)">\n' +
    '        <img ng-src="{{user | chatPicture}}">\n' +
    '        <h2>{{user.profile.name}}</h2>\n' +
    '        <p>{{user.emails[0].address}} {{user.profile.phone}}</p>\n' +
    '        <span ng-if="!user.activate" class="badge badge-assertive">Not Active</span>\n' +
    '        <i class="icon ion-chevron-right icon-accessory"></i>\n' +
    '\n' +
    '        <ion-option-button class="button-assertive" ng-click="activate(user)">\n' +
    '          Activate\n' +
    '        </ion-option-button>\n' +
    '      </ion-item>\n' +
    '    </ion-list>\n' +
    '  </ion-content>\n' +
    '</ion-view>');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/login/confirmation.html',
    '<ion-view title="{{phone}}">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button ng-click="verify()" ng-disabled="!data.code || data.code.length === 0" class="button button-clear button-positive">Done</button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content>\n' +
    '    <div class="text-center padding">\n' +
    '      We have sent you an SMS with a code to the number above\n' +
    '    </div>\n' +
    '    <div class="text-center padding">\n' +
    '      To complete your phone number verification chatty, please enter the 4-digit activation code.\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="list padding-top">\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.code" on-return="verify()" type="text" placeholder="Code">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/login/login.html',
    '<ion-view title="Your phone number">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button ng-click="login()" class="button button-clear button-positive">Done</button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content class="login">\n' +
    '    <div class="text-center instructions">\n' +
    '      Please Login\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="list">\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.email" type="text" placeholder="Your Email">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.password" type="password" placeholder="Your password">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="padding text-center">\n' +
    '      <button ui-sref="register" class="button button-clear button-assertive">Register</button>\n' +
    '    </div>\n' +
    '\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/login/pending.html',
    '<ion-view title="Pending">\n' +
    '\n' +
    '  <ion-content class="pending">\n' +
    '    <div class="text-center instructions">\n' +
    '      Please wait until your account have been verified.\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-view>');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/login/register.html',
    '<ion-view title="Register">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button ng-click="register()" ng-disabled="!data.profile.phone || data.profile.phone.length === 0" class="button button-clear button-positive">Done</button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content class="register">\n' +
    '    <div class="text-center instructions">\n' +
    '      Please enter you registration infomation.\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="list">\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.email" type="text" placeholder="Your Email Address">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.password" type="password" placeholder="Your password">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-view>');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/setting/profile.html',
    '<ion-view title="Profile" cache-view="false">\n' +
    '  <ion-nav-buttons side="right">\n' +
    '    <button ng-click="updateName()" ng-disabled="!data.name || data.name.length === 0" class="button button-clear button-positive">Done</button>\n' +
    '  </ion-nav-buttons>\n' +
    '\n' +
    '  <ion-content class="profile">\n' +
    '    <a class="profile-picture positive">\n' +
    '      <div class="upload-placehoder">\n' +
    '        Add photo\n' +
    '      </div>\n' +
    '    </a>\n' +
    '\n' +
    '    <div class="instructions">\n' +
    '      Enter your name and add an optional profile picture\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="list profile-name">\n' +
    '      <label class="item item-input">\n' +
    '        <input ng-model="data.name" on-return="updateName()" type="text" placeholder="Your name">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('chattyTemplates');
} catch (e) {
  module = angular.module('chattyTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('js/controllers/setting/tab-settings.html',
    '<ion-view view-title="Settings">\n' +
    '  <ion-content>\n' +
    '    <div class="padding text-center">\n' +
    '      <button ng-click="logout()" class="button button-clear button-assertive">Logout</button>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();
