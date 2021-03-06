openFarmApp.controller('cropCtrl', ['$scope', '$http', 'cropService',
  function cropCtrl($scope, $http, cropService) {
    $scope.s3upload = '';
    $scope.crop = {};
    var cropId = getIDFromURL('crops');
    if (cropId !== 'new' && cropId !== undefined) {
      cropService.getCropWithPromise(cropId)
        .then(function(crop){
          $scope.crop = crop;
        })
    } else {
      $scope.crop = {
        'is_new': true,
        'pictures': []
      };
    }


    $scope.submitForm = function(){
      $scope.crop.sending = true;

      var commonNames = $scope.crop.common_names;
      if (typeof $scope.crop.common_names === 'string'){
        commonNames = $scope.crop.common_names.split(/,+|\n+/)
                        .map(function(s){ return s.trim(); });
        if (commonNames !== null){
          commonNames = commonNames.filter(function(s){
            return s.length > 0;
          });
        }
      }

      var crop = {
        common_names: commonNames,
        name: $scope.crop.name,
        description: $scope.crop.description || null,
        binomial_name: $scope.crop.binomial_name || null,
        sun_requirements: $scope.crop.sun_requirements || null,
        sowing_method: $scope.crop.sowing_method || null,
        spread: $scope.crop.spread || null,
        row_spacing: $scope.crop.row_spacing || null,
        height: $scope.crop.height || null,
      }

      if ($scope.crop.pictures !== undefined){
        crop.images = $scope.crop.pictures.filter(function(d){
          return !d.deleted;
        });
      }
      console.log($scope.crop.pictures);

      var cropCallback = function(success, crop){
        // $scope.crop.sending = false;
        if (success) {
          window.location.href = '/crops/' + $scope.crop.id + '/';
        }
      };

      if ($scope.crop.is_new) {
        cropService.createCropWithPromise(crop)
          .then(function(crop) {
            // $scope.crop.sending = false;
            window.location.href = '/crops/' + crop.id + '/';
          })
      } else {
        cropService.updateCrop($scope.crop.id,
                               crop,
                               cropCallback, function(err) {
                                console.log('err', err)
                               });
      }
    };

    $scope.placeCropUpload = function(image){
      $scope.crop.pictures.push({
        new: true,
        image_url: image
      });
    };
  }]);
