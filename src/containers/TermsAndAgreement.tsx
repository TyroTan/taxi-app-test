import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// import { GradientButton, HeaderBack } from '../../commons/components';
import { INavigation } from '../..';
import { scale, primaryPalette } from '../utils';
import { useState } from 'reactn';
import Modal from 'react-native-modal';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { ButtonShadowed } from '../commons/components';
import { NavigationStackOptions } from 'react-navigation-stack';

const styles = StyleSheet.create({
  wrapper: {
    // width: MAX_HEADER_IMAGE_WIDTH,
    // height: '90%',
    marginTop: getStatusBarHeight(true),
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  headerText: {
    // ...commonStyles.h2,
    padding: scale(10),
    fontFamily: 'Avenir',
    color: primaryPalette.dark,
    fontWeight: '800',
    fontSize: scale(18),
    lineHeight: scale(26),
  },
  termsText: {
    // ...commonStyles.h4,
    textAlign: 'justify',
    padding: 10,
  },
  footer: {
    marginTop: 20,
  },
});

type Props = INavigation<{
  drawer?: boolean;
}>;

const TermsAndAgreement: React.FC<Props> = ({ navigation }) => {
  // const isFromDrawer = navigation.getParam('drawer') === true;
  const [loading, setLoading] = useState<boolean>(true);
  // const userData = getUserSessionSel().user;

  const termsLabel = `Terms of use and conditions may apply`;

  const baconIpsumText = `
  TERMS OF USE
  
  The DollarBack.com website is owned and operated by New Market Technologies, LLC.  The following Terms of Use contain the complete terms and conditions that apply to an individual's or entity's use of this and other sites that are operated by New Market Technologies, LLC site. As used in this Agreement, "We," "Us" or "Our" refers to New Market Technologies, LLC, and "You" or "Your" refers to the user. "Site" means any New Market Technologies, LLC site posted on the World Wide Web.

1. ACCEPTANCE OF TERMS AND CONDITIONS
Use of Our Site constitutes Your acceptance of these terms and conditions and Your waiver of any and all claims against New Market Technologies, LLC, its parents, subsidiaries, affiliates, contractors, agents, officers, directors or employees arising out of Your use of Our Site or any materials, information, opinions or recommendations contained on Our Site.

2. MODIFICATION
We may modify any of the terms and conditions in these Terms of Use, at any time and in Our sole discretion, by posting a change notice or a new user agreement on Our Site. IF ANY MODIFICATION IS UNACCEPTABLE TO YOU, YOUR ONLY RECOURSE IS TO TERMINATE YOUR USE OF OUR SITE. YOUR CONTINUED USE OF OUR SITE FOLLOWING OUR POSTING OF A CHANGE NOTICE OR NEW TERMS OF USE CONSTITUTES BINDING ACCEPTANCE OF THE CHANGE.

3. COPYRIGHT

All content included on Our Site, such as text, graphics, logos, button icons, images, audio clips and software, is Our property or that of Our content suppliers and is protected by U.S. and international copyright laws.  

4. DISCLAIMER
WE PROVIDE OUR SITE ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO EXPRESS OR IMPLIED WARRANTIES WITH RESPECT TO THE OPERATION OF OUR SITE OR THE INFORMATION, CONTENT, SOFTWARE OR MATERIALS AVAILABLE ON OUR SITE (INCLUDING, WITHOUT LIMITATION, WARRANTIES OF FITNESS, MERCHANTABILITY, NONINFRINGEMENT, OR ANY IMPLIED WARRANTIES ARISING OUT OF COURSE OF PERFORMANCE, DEALING OR TRADE USAGE). IN ADDITION, WE MAKE NO REPRESENTATION THAT THE OPERATION OF OUR SITE WILL BE UNINTERRUPTED OR ERROR-FREE, AND WE WILL NOT BE LIABLE FOR THE CONSEQUENCES OF ANY INTERRUPTION OR ERRORS. FURTHER, WE TAKE NO RESPONSIBILITY FOR THE CONTENT OF ANY LINKS PROVIDED THROUGH OUR SITE OR FOR THE SITES OF OTHERS THAT LINK TO OUR SITE.

5. CONFIDENTIAL INFORMATION
We do not accept or consider unsolicited material, product suggestions or original or creative ideas (collectively, "Materials") submitted through Our Site. If despite this policy you submit any such Materials, We will deem it Our property. We will not treat the Materials as confidential, and We will not be liable for any use or disclosure of such Materials. Without limitation, We will own the exclusive rights to the Materials and will be entitled to unrestricted use of the Materials for any purpose, commercial or otherwise, without compensation to the submitter of such Materials.

6. LIMITATION OF LIABILITY
WE WILL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES (OR ANY LOSS OF REVENUE, PROFITS OR DATA) OF ANY KIND ARISING IN CONNECTION WITH THE USE OF OUR SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHER, OUR AGGREGATE LIABILITY ARISING WITH RESPECT TO THIS AGREEMENT WILL NOT EXCEED THE AMOUNT PAID US BY YOU IF ANY, FOR ACCESSING OUR SITE.

7. INDEMNIFICATION
You will defend and hold harmless New Market Technologies, LLC, its parents, subsidiaries, affiliates, contractors, agent, officers, directors and employees against all claims, losses, damages, liabilities, costs and expenses (including reasonable attorneys' fees and costs) made due to or arising out of a violation of these Terms of Use or Your use of this Site, including, without limitation, any claim arising out of unauthorized links to Our Site.

8. DONATIONS FOR ONLINE PURCHASES
Organizations that register to participate and are accepted into the DollarBack program will receive donations for:

Online purchases when all of the following conditions are met:
a)      Purchaser has properly entered the organization’s DollarBack Code and the name of the organization or fundraiser appears at the top of the DollarBack website.

b)      Purchaser clicks on the merchants link from the DollarBack.com website. 

c)      The merchant has paid DollarBack the commission due for the transaction.

d)      Donations will be made quarterly and will be mailed approximately 15 days after the close of each calendar quarter.

The donation % or dollar amount that will be made to each organization for qualifying online purchases is typically shown adjacent to the link for each of the participating merchants.  100% of the amount shown will be donated to the organization when all of the conditions outlined in accordance with the terms specified above are met.   The donation % or dollar amount that is shown is subject to change without notice.

9 MISCELLANEOUS

9.1 Nonwaiver. If We fail to insist upon or enforce strict performance of any provision or right under the terms and conditions of these Terms of Use, it will not be construed as a waiver of any provision or right; rather, the same will be and remain in full force and effect.

9.2 Choice of Law. These Terms of Use will be interpreted, construed and enforced in all respects in accordance with the laws of the Commonwealth of Massachusetts to the exclusion of any other law which may be imputed in accordance with choice of law rules applicable in any jurisdiction. The 1980 U.N. Convention on Contracts for the International Sale of Goods or any successor thereto does not apply to these Terms of Use. For any suit or claim pertaining to these Terms of Use or any information furnished hereunder, You irrevocably consent to the jurisdiction and venue of any state or federal court sitting in Middlesex County, Massachusetts,  USA, and You will not commence an action or proceeding relating to the subject matter of these Terms of Use in any other jurisdiction. 

9.3 English Language Governs. It is the express wish of the parties that these Terms of Use be drawn up in English. C'est la volonté explicite des parties que ces termes d'usage soient rédiger en anglais.

9.4 Independent Contractor. These Terms of Use will not be interpreted or construed to create or evidence a partnership, joint venture or franchise relationship among the parties or as imposing any partnership or franchiser obligation or liability on either party.

9.5 Compliance With Laws. You will comply at Your own expense with all statutes, regulations, rules, ordinances and orders of any governmental body, department or agency that apply to or result from Your use of Our Site.

9.6. Severability. If any provision of these Terms of Use will be unlawful, void or for any reason unenforceable, then that provision will be deemed severable from and will not affect the validity and enforceability of any remaining provisions.

OUR ADDRESS:
New Market Technologies, LLC
249 Burnt Meadow Road, Suite 200
Groton, MA, 01450`;

  useEffect(() => {
    setTimeout((): void => {
      setLoading(false);
    }, 9000);
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1 }}>
      <Modal isVisible={loading}>
        <ActivityIndicator />
      </Modal>
      <View style={styles.wrapper}>
        <ScrollView>
          <Text style={styles.headerText}>{termsLabel}</Text>
          <TextInput multiline editable={false} style={styles.termsText}>
            {baconIpsumText}
          </TextInput>
          <ButtonShadowed
            // eslint-disable-next-line react-native/no-inline-styles
            btnStyle={{
              marginVertical: scale(20),
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            onPress={(): void => {
              navigation.navigate('SignupStack');
            }}
          />
        </ScrollView>
        <View style={styles.footer} />
      </View>
    </View>
  );
};

TermsAndAgreement.navigationOptions = (): NavigationStackOptions => {
  return {
    header: null,
  };
};

export default TermsAndAgreement;
